import os


def update_navigation_links(module_path):
    lessons = sorted([f for f in os.listdir(module_path) if f.endswith('.md')])
    for i, lesson in enumerate(lessons):
        with open(os.path.join(module_path, lesson), 'r+') as file:
            content = file.read()
            prev_link = f"/{module_path}/{lessons[i-1].replace('.md', '/')}" if i > 0 else "#"
            next_link = f"/{module_path}/{lessons[i+1].replace('.md', '/')}" if i < len(lessons) - 1 else "#"
            content = content.replace('{{ prev_link }}', prev_link).replace('{{ next_link }}', next_link)
            file.seek(0)
            file.write(content)
            file.truncate()


def main():
    modules = ['src/curso/modulo-01', 'src/curso/modulo-02']
    for module in modules:
        update_navigation_links(module)


if __name__ == "__main__":
    main() 