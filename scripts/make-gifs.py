"""Build the looping background GIFs used behind the player."""

import math
import os
import random

from PIL import Image, ImageDraw, ImageFilter

W, H = 480, 300
FRAMES = 24
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "gifs")


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient(top, bottom):
    column = Image.new("RGB", (1, H))
    pixels = column.load()
    for y in range(H):
        pixels[0, y] = lerp(top, bottom, y / (H - 1))
    return column.resize((W, H), Image.Resampling.BILINEAR)


def glow(cx, cy, rx, ry, color, alpha, blur):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=(*color, alpha))
    return layer.filter(ImageFilter.GaussianBlur(blur))


def stack(base, *layers):
    image = base.convert("RGBA")
    for layer in layers:
        image = Image.alpha_composite(image, layer)
    return image.convert("RGB")


def grain(image, amount=0.05):
    noise = Image.effect_noise(image.size, 22).convert("L")
    tint = Image.merge("RGB", (noise, noise, noise))
    return Image.blend(image, tint, amount)


def save_gif(name, frames):
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, f"{name}.gif")
    sample = Image.new("RGB", (W, len(frames) * 8))
    for index, frame in enumerate(frames[::4]):
        sample.paste(frame.resize((W, 8), Image.Resampling.BOX), (0, index * 8))
    palette = sample.quantize(colors=48, method=Image.Quantize.MEDIANCUT)
    paletted = [
        frame.quantize(palette=palette, dither=Image.Dither.FLOYDSTEINBERG) for frame in frames
    ]
    paletted[0].save(
        path,
        save_all=True,
        append_images=paletted[1:],
        duration=120,
        loop=0,
        optimize=True,
        disposal=1,
    )
    print(f"{name}: {os.path.getsize(path) // 1024} KB")


def make_rain():
    frames = []
    base = grain(gradient((18, 28, 42), (8, 12, 18)))
    lamp = glow(W * 0.5, H * 0.42, 180, 140, (150, 186, 214), 70, 36)
    for frame in range(FRAMES):
        streaks = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        draw = ImageDraw.Draw(streaks)
        shift = frame * 18
        rng = random.Random(3)
        for _ in range(90):
            x = rng.randrange(0, W)
            length = rng.randint(18, 36)
            y = (rng.randrange(0, H + 80) + shift) % (H + 80) - 40
            draw.line((x, y, x + 10, y + length), fill=(198, 214, 230, 90), width=1)
        streaks = streaks.filter(ImageFilter.GaussianBlur(0.4))
        frames.append(stack(base, lamp, streaks))
    save_gif("rain", frames)


def make_dusk():
    frames = []
    base = grain(gradient((74, 42, 32), (16, 10, 16)), 0.04)
    for frame in range(FRAMES):
        phase = frame / FRAMES
        cx = W * (0.38 + 0.24 * math.sin(phase * math.tau))
        sun = glow(cx, H * 0.28, 120, 120, (255, 168, 96), 170, 18)
        haze = glow(cx, H * 0.36, 240, 90, (180, 70, 60), 80, 30)
        frames.append(stack(base, haze, sun))
    save_gif("dusk", frames)


def make_city():
    frames = []
    base = grain(gradient((16, 18, 36), (12, 8, 20)))
    lights = [
        (0.15, (110, 168, 255), 70),
        (0.38, (224, 122, 168), 54),
        (0.62, (232, 193, 90), 60),
        (0.84, (120, 210, 190), 48),
    ]
    for frame in range(FRAMES):
        phase = frame / FRAMES
        layers = []
        for index, (start, color, radius) in enumerate(lights):
            x = ((start + phase * (0.35 + index * 0.08)) % 1.25 - 0.12) * W
            layers.append(glow(x, H * (0.42 + index * 0.04), radius, 16, color, 150, 10))
        frames.append(stack(base, *layers))
    save_gif("city", frames)


def make_room():
    frames = []
    base = grain(gradient((28, 20, 14), (12, 9, 8)))
    for frame in range(FRAMES):
        pulse = 0.82 + 0.18 * math.sin(frame / FRAMES * math.tau)
        alpha = int(150 * pulse)
        window = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        draw = ImageDraw.Draw(window)
        rect = (W * 0.34, H * 0.12, W * 0.66, H * 0.62)
        draw.rounded_rectangle(rect, radius=10, fill=(255, 206, 150, alpha))
        window = window.filter(ImageFilter.GaussianBlur(16))
        spill = glow(W * 0.5, H * 0.72, 220, 50, (255, 170, 90), int(70 * pulse), 20)
        frames.append(stack(base, spill, window))
    save_gif("room", frames)


def make_sea():
    frames = []
    sky = grain(gradient((14, 32, 40), (10, 28, 32)), 0.04)
    for frame in range(FRAMES):
        phase = frame / FRAMES * math.tau
        moon = glow(W * 0.68, H * 0.24, 36, 36, (230, 244, 236), 200, 2)
        halo = glow(W * 0.68, H * 0.24, 90, 70, (160, 210, 200), 80, 16)
        water = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        draw = ImageDraw.Draw(water)
        for band in range(7):
            y_base = H * 0.58 + band * 16
            points = []
            for x in range(0, W + 8, 8):
                y = y_base + math.sin(x * 0.02 + phase + band) * (4 + band * 0.4)
                points.append((x, y))
            draw.line(points, fill=(170, 214, 206, 50 + band * 6), width=2)
        water = water.filter(ImageFilter.GaussianBlur(0.8))
        frames.append(stack(sky, halo, moon, water))
    save_gif("sea", frames)


if __name__ == "__main__":
    make_rain()
    make_dusk()
    make_city()
    make_room()
    make_sea()
