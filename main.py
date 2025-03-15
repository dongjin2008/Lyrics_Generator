slide = 0
result = []
part = {}

with open("lyrics.txt", "r") as file:
    lyrics = file.read()
    lines = lyrics.split('\n')

    current_index = 0
    temp_lyrics = []

    i = 0
    while i < len(lines):
        line = lines[i].strip()
        # Check if the line is just a single letter (A, B, C, etc.)
        if len(line) == 1 and line.isalpha() and line.isupper():
            part[line] = current_index
            i += 1  # Skip the letter line
        else:
            temp_lyrics.append(line)
            i += 1

        # If we encounter a separator or reach the end
        if i < len(lines) and lines[i] == "//" or i == len(lines):
            if temp_lyrics:  # Only add non-empty sections
                result.append('\n'.join(temp_lyrics))
                temp_lyrics = []
                current_index += 1
                i += 1  # Skip the separator

    # Add an END marker
    part["END"] = len(result)

UI = input("Enter the order(ABC): ")
keys = list(part.keys())
new_lyrics = []

for o in UI:
    if o == "M":
        new_lyrics.append("")
    else:
        next_key = None
        for k in keys:
            if k != o and part[k] > part[o]:
                if next_key is None or part[k] < part[next_key]:
                    next_key = k

        if next_key:
            for i in range(part[o], part[next_key]):
                new_lyrics.append(result[i])
        else:
            # If there's no next key, go to the end
            for i in range(part[o], part["END"]):
                new_lyrics.append(result[i])

print("Part dictionary:", part)
print("\nGenerated lyrics:")
for t in new_lyrics:
    print(t)

# Create a new text file with the generated lyrics
output_file_path = "/Users/dongjin/Project/Lyrics Generator/generated_lyrics.txt"
with open(output_file_path, "w") as output_file:
    for i, lyric in enumerate(new_lyrics):
        output_file.write(lyric)
        # Add separator after each section except the last one
        if i < len(new_lyrics) - 1:
            output_file.write("\n//\n")

print(f"\nGenerated lyrics saved to {output_file_path}")