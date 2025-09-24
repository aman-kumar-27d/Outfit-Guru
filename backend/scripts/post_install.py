import os
import sys
import pathlib

def patch_fashion_clip():
    try:
        import fashion_clip
        pkg_path = pathlib.Path(fashion_clip.__file__).parent
        fclip_file = pkg_path / "fashion_clip.py"

        with open(fclip_file, "r", encoding="utf-8") as f:
            code = f.read()

        # Comment out annoy import if exists
        if "from annoy import AnnoyIndex" in code:
            patched = code.replace("from annoy import AnnoyIndex", "# from annoy import AnnoyIndex")
            with open(fclip_file, "w", encoding="utf-8") as f:
                f.write(patched)
            print("✅ Patched fashion_clip to bypass Annoy")
        else:
            print("ℹ️ Already patched, skipping")

    except Exception as e:
        print("❌ Patch failed:", e)

if __name__ == "__main__":
    patch_fashion_clip()
