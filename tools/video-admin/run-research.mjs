// Command-line batch research for the seven bookshelf courses. Never import in the student app.
// Progress is saved after every query, so a quota stop resumes from the same place on the next run.
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { researchAll, researchReport } from './batch.mjs';
import { courses, topics } from '../../src/grade5/catalog.ts';

export const bookshelfCourseIds = ['course-0','course-1','course-2','course-3','course-4','course-5','course-6'];
export const bookshelf = { courses: courses.filter(c => bookshelfCourseIds.includes(c.id)), topics: topics.filter(t => bookshelfCourseIds.includes(t.courseId)) };

export async function run({ directory, key, fetcher = fetch, now = () => new Date(), paceMs = 1200 }) {
 const stateFile = path.join(directory, 'state.json');
 await mkdir(directory, { recursive: true });
 let state;
 try { state = JSON.parse(await readFile(stateFile, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; state = { version: 1, videos: [] }; }
 const save = async next => { await writeFile(stateFile + '.tmp', JSON.stringify(next, null, 1) + '\n'); await rename(stateFile + '.tmp', stateFile); };
 state = await researchAll({ state, ...bookshelf, key, fetcher, now, paceMs, onProgress: save });
 await save(state);
 return { state, report: { ...researchReport(state, bookshelf.topics), status: state.research?.status, retryAfter: state.research?.retryAfter || null } };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
 const root = fileURLToPath(new URL('../../', import.meta.url));
 const directory = process.env.EYLUNICA_VIDEO_ADMIN_DATA_DIR || path.join(root, 'data/video-research');
 const { report } = await run({ directory, key: process.env.YOUTUBE_API_KEY });
 console.log(JSON.stringify(report, null, 2));
}
