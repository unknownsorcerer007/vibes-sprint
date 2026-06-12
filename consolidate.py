import sys

# Read index.html lines
with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []

# Part 1: Keep head and start of body (lines 1 to 25, 0-indexed 0 to 25)
new_lines.extend(lines[0:25])

# Skip showcase controller (lines 26 to 62, 0-indexed 25 to 62)

# Part 2: Keep HORIZONTAL SLIDER VIEWPORT start (lines 63 to 66, 0-indexed 62 to 66)
new_lines.extend(lines[62:66])

# Skip slides 0, 1, 2 (lines 67 to 730, 0-indexed 66 to 730)

# Part 3: Keep VeloceFit slide (lines 731 to 940, 0-indexed 730 to 940)
# We need to modify section opening tag in slide 3
velocefit_slide = lines[730:940]
for idx, line in enumerate(velocefit_slide):
    if 'id="slide-3"' in line:
        velocefit_slide[idx] = line.replace('id="slide-3"', 'id="slide-0"').replace('class="slide lp-velocefit"', 'class="slide lp-velocefit active"')
new_lines.extend(velocefit_slide)

# Skip slides 4 to 10 (lines 941 to 2038, 0-indexed 940 to 2038)

# Part 4: Keep from line 2039 (0-indexed 2038) to end of file
new_lines.extend(lines[2038:])

# Write to consolidated.html to verify first
with open('consolidated.html', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Consolidated HTML written to consolidated.html")
