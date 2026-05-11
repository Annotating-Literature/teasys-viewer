import { readFileSync, writeFileSync, unlinkSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';

const MIME: Record<string, string> = {
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	png: 'image/png',
	webp: 'image/webp',
	gif: 'image/gif',
	svg: 'image/svg+xml',
	avif: 'image/avif',
};

const BASE_DIR = resolve('data/storage');

function makeR2Object(filePath: string, key: string): R2ObjectBody & { writeHttpMetadata: (h: Headers) => void } {
	const data = readFileSync(filePath);
	const ext = key.split('.').pop()?.toLowerCase() ?? '';
	const contentType = MIME[ext] ?? 'application/octet-stream';
	return {
		writeHttpMetadata(headers: Headers) {
			headers.set('Content-Type', contentType);
		},
		get body(): ReadableStream {
			return new ReadableStream({
				start(ctrl) {
					ctrl.enqueue(data);
					ctrl.close();
				},
			});
		},
		async arrayBuffer(): Promise<ArrayBuffer> {
			return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
		},
	} as unknown as R2ObjectBody & { writeHttpMetadata: (h: Headers) => void };
}

export function getLocalBucket(): R2Bucket {
	mkdirSync(BASE_DIR, { recursive: true });

	return {
		async get(key: string): Promise<(R2ObjectBody & { writeHttpMetadata: (h: Headers) => void }) | null> {
			const filePath = join(BASE_DIR, key);
			if (!existsSync(filePath)) return null;
			return makeR2Object(filePath, key);
		},
		async put(key: string, value: ReadableStream | ArrayBuffer | ArrayBufferView | string | null | Blob, options?: R2PutOptions): Promise<R2Object> {
			const filePath = join(BASE_DIR, key);
			mkdirSync(dirname(filePath), { recursive: true });
			let buf: Buffer;
			if (value instanceof ArrayBuffer) {
				buf = Buffer.from(value);
			} else if (ArrayBuffer.isView(value)) {
				buf = Buffer.from(value.buffer, value.byteOffset, value.byteLength);
			} else if (typeof value === 'string') {
				buf = Buffer.from(value, 'utf-8');
			} else if (value instanceof Blob) {
				buf = Buffer.from(await value.arrayBuffer());
			} else {
				buf = Buffer.alloc(0);
			}
			writeFileSync(filePath, buf);
			return {} as R2Object;
		},
		async delete(keys: string | string[]): Promise<void> {
			for (const key of Array.isArray(keys) ? keys : [keys]) {
				const filePath = join(BASE_DIR, key);
				if (existsSync(filePath)) {
					try {
						unlinkSync(filePath);
					} catch {}
				}
			}
		},
		async head(key: string): Promise<R2Object | null> {
			const filePath = join(BASE_DIR, key);
			return existsSync(filePath) ? ({} as R2Object) : null;
		},
		async list(): Promise<R2Objects> {
			return { objects: [], truncated: false, delimitedPrefixes: [] } as unknown as R2Objects;
		},
		async createMultipartUpload(): Promise<R2MultipartUpload> {
			throw new Error('Multipart uploads not supported in local storage');
		},
		async resumeMultipartUpload(): Promise<R2MultipartUpload> {
			throw new Error('Multipart uploads not supported in local storage');
		},
	} as unknown as R2Bucket;
}
