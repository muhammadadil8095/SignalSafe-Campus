"""
Generate minimal PWA icons (192x192, 512x512) using only the Python stdlib.
Produces simple PNG files — no external dependencies required.
Run: python scripts/gen_icons.py
"""
import struct
import zlib
import os

def make_png(size: int, output_path: str) -> None:
    """Create a solid blue shield-style square PNG at `size` x `size`."""
    width = height = size

    # RGBA rows: navy background with a simple centred dot
    rows: list[bytes] = []
    cx, cy = width // 2, height // 2
    r_outer = int(width * 0.35)
    r_inner = int(width * 0.12)

    for y in range(height):
        row: list[int] = []
        for x in range(width):
            dx, dy = x - cx, y - cy
            dist = (dx * dx + dy * dy) ** 0.5
            if dist <= r_inner:
                # White centre dot
                row += [255, 255, 255, 255]
            elif dist <= r_outer:
                # Blue ring
                row += [59, 130, 246, 255]   # blue-500
            else:
                # Dark navy background
                row += [15, 23, 42, 255]     # slate-950
        rows.append(b"\x00" + bytes(row))

    raw = b"".join(rows)
    compressed = zlib.compress(raw, 9)

    def chunk(tag: bytes, data: bytes) -> bytes:
        c = struct.pack(">I", len(data)) + tag + data
        return c + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    ihdr_data = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", ihdr_data)
        + chunk(b"IDAT", compressed)
        + chunk(b"IEND", b"")
    )

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(png)
    print(f"  Written {output_path} ({len(png)} bytes)")


if __name__ == "__main__":
    base = os.path.join(os.path.dirname(__file__), "..", "public", "icons")
    for sz in (192, 512):
        make_png(sz, os.path.join(base, f"icon-{sz}.png"))
    print("Done.")
