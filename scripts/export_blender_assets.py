from pathlib import Path

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "blender"
MODEL_DIR = ROOT / "public" / "models"
IMAGE_DIR = ROOT / "public" / "catalog"

ASSETS = [
    ("house", "house.blend"),
    ("cat", "cat.blend"),
    ("chair", "chair.blend"),
    ("lamp", "lamp.blend"),
    ("mag", "mag.blend"),
]


def mesh_objects():
    return [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]


def select_meshes():
    bpy.ops.object.select_all(action="DESELECT")
    meshes = mesh_objects()
    for obj in meshes:
        obj.select_set(True)
    if meshes:
        bpy.context.view_layer.objects.active = meshes[0]
    return meshes


def world_bounds(objs):
    corners = []
    for obj in objs:
        for corner in obj.bound_box:
            corners.append(obj.matrix_world @ Vector(corner))
    min_corner = Vector(
        (
            min(v.x for v in corners),
            min(v.y for v in corners),
            min(v.z for v in corners),
        )
    )
    max_corner = Vector(
        (
            max(v.x for v in corners),
            max(v.y for v in corners),
            max(v.z for v in corners),
        )
    )
    return min_corner, max_corner


def look_at(obj, target):
    direction = target - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def ensure_camera_and_lights(min_corner, max_corner):
    center = (min_corner + max_corner) * 0.5
    size = max(max_corner.x - min_corner.x, max_corner.y - min_corner.y, max_corner.z - min_corner.z)
    size = max(size, 1.0)

    camera = bpy.data.objects.get("CodexCamera")
    if camera is None:
      camera_data = bpy.data.cameras.new("CodexCamera")
      camera = bpy.data.objects.new("CodexCamera", camera_data)
      bpy.context.scene.collection.objects.link(camera)
    camera.location = center + Vector((size * 1.8, -size * 2.4, size * 1.1))
    look_at(camera, center)
    camera.data.lens = 60
    bpy.context.scene.camera = camera

    sun = bpy.data.objects.get("CodexSun")
    if sun is None:
      sun_data = bpy.data.lights.new("CodexSun", type="SUN")
      sun = bpy.data.objects.new("CodexSun", sun_data)
      bpy.context.scene.collection.objects.link(sun)
    sun.location = center + Vector((size * 2.0, size * 2.0, size * 3.0))
    sun.data.energy = 3.2

    area = bpy.data.objects.get("CodexArea")
    if area is None:
      area_data = bpy.data.lights.new("CodexArea", type="AREA")
      area = bpy.data.objects.new("CodexArea", area_data)
      bpy.context.scene.collection.objects.link(area)
    area.location = center + Vector((-size * 1.6, -size * 1.8, size * 1.8))
    look_at(area, center)
    area.data.energy = 2500
    area.data.shape = "RECTANGLE"
    area.data.size = size * 2.0
    area.data.size_y = size * 2.0


def setup_render():
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.image_settings.file_format = "PNG"
    scene.render.resolution_x = 1400
    scene.render.resolution_y = 1050
    scene.render.film_transparent = False
    scene.render.use_persistent_data = False
    scene.eevee.taa_render_samples = 64
    world = scene.world or bpy.data.worlds.new("World")
    scene.world = world
    world.use_nodes = True
    background = world.node_tree.nodes.get("Background")
    if background:
        background.inputs[0].default_value = (0.03, 0.06, 0.11, 1.0)
        background.inputs[1].default_value = 0.9


def export_asset(slug, blend_name):
    blend_path = SOURCE_DIR / blend_name
    bpy.ops.wm.open_mainfile(filepath=str(blend_path))

    meshes = select_meshes()
    if not meshes:
        raise RuntimeError(f"No mesh objects found in {blend_name}")

    min_corner, max_corner = world_bounds(meshes)
    ensure_camera_and_lights(min_corner, max_corner)
    setup_render()

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)

    glb_path = MODEL_DIR / f"{slug}.glb"
    png_path = IMAGE_DIR / f"{slug}-render.png"

    bpy.ops.export_scene.gltf(
        filepath=str(glb_path),
        export_format="GLB",
        use_selection=False,
    )

    bpy.context.scene.render.filepath = str(png_path)
    bpy.ops.render.render(write_still=True)


def main():
    for slug, blend_name in ASSETS:
        export_asset(slug, blend_name)


if __name__ == "__main__":
    main()
