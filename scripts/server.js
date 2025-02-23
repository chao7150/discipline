import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(dirname(fileURLToPath(import.meta.url)));
const port = 3000;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.md': 'text/markdown'
};

const server = createServer(async (req, res) => {
    try {
        // URLからファイルパスを取得（クエリパラメータを除去）
        const filePath = join(__dirname, req.url.split('?')[0] === '/' ? 'index.html' : req.url);
        const extname = '.' + filePath.split('.').pop().toLowerCase();
        const contentType = mimeTypes[extname] || 'application/octet-stream';

        // ファイルを読み込んでレスポンスを返す
        const content = await readFile(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.writeHead(404);
            res.end('File not found');
        } else {
            res.writeHead(500);
            res.end(`Server error: ${error.code}`);
        }
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
