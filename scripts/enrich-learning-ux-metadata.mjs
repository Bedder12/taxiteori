import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = 'data/content';

function visit(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? visit(path) : entry.name.endsWith('-lessons.json') ? [path] : [];
  });
}

for (const path of visit(root)) {
  const document = JSON.parse(readFileSync(path, 'utf8').replace(/^\uFEFF/, ''));
  const previousByTopic = new Map();
  document.lessons = document.lessons.map((lesson) => {
    const previous = previousByTopic.get(lesson.topic_id);
    previousByTopic.set(lesson.topic_id, lesson.stable_key);
    const paragraph = lesson.content_blocks.find((block) => block.type === 'paragraph' && block.text)?.text;
    return {
      ...lesson,
      summary: lesson.summary ?? paragraph ?? lesson.learning_objectives?.[0] ?? lesson.title,
      learning_objectives: lesson.learning_objectives?.length ? lesson.learning_objectives : [paragraph ?? lesson.title],
      prerequisite_lesson_keys: lesson.prerequisite_lesson_keys ?? (previous ? [previous] : []),
    };
  });
  writeFileSync(path, `${JSON.stringify(document, null, 2)}\n`);
}

console.log(`Enriched ${visit(root).length} lesson files with deterministic UX metadata.`);