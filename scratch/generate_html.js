const fs = require('fs');
const path = require('path');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\f31ce5d6-2235-420e-8539-c5add179efd0\\.system_generated\\logs\\transcript.jsonl';
const outputPath = 'C:\\Users\\USER\\Downloads\\hj-website\\chat_history.html';

async function generateHtml() {
    const fileStream = fs.createReadStream(transcriptPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>對話紀錄展示</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f3f4f6; padding: 20px; color: #1f2937; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .message { margin-bottom: 20px; padding: 15px; border-radius: 8px; }
        .user { background: #e0f2fe; margin-right: 20px; border-left: 4px solid #3b82f6; }
        .model { background: #f3f4f6; margin-left: 20px; border-left: 4px solid #10b981; }
        .header { font-weight: bold; margin-bottom: 8px; font-size: 0.9em; color: #4b5563; }
        pre { background: #1f2937; color: #f3f4f6; padding: 10px; border-radius: 4px; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word; }
        code { font-family: monospace; }
        .system { color: #6b7280; font-size: 0.85em; font-style: italic; margin-bottom: 15px; }
        .tool { background: #fffbeb; padding: 10px; border: 1px solid #fde68a; border-radius: 4px; font-size: 0.9em; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <h1 style="text-align:center; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Antigravity 對話紀錄</h1>
`;

    for await (const line of rl) {
        if (!line.trim()) continue;
        try {
            const entry = JSON.parse(line);
            
            if (entry.source === 'USER_EXPLICIT' && entry.type === 'USER_INPUT') {
                html += `        <div class="message user">\n`;
                html += `            <div class="header">User</div>\n`;
                let content = entry.content || '';
                // Simple escaping
                content = content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\\n/g, '<br>');
                html += `            <div>${content}</div>\n`;
                html += `        </div>\n`;
            } else if (entry.source === 'MODEL' && entry.type === 'PLANNER_RESPONSE') {
                html += `        <div class="message model">\n`;
                html += `            <div class="header">Antigravity AI</div>\n`;
                let content = entry.content || '';
                content = content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\\n/g, '<br>');
                if (content) {
                    html += `            <div>${content}</div>\n`;
                }
                
                if (entry.tool_calls && entry.tool_calls.length > 0) {
                    html += `            <div class="tool">\n`;
                    html += `                <strong>Tool Calls:</strong><ul>\n`;
                    for (const tc of entry.tool_calls) {
                        html += `<li>${tc.name}</li>`;
                    }
                    html += `                </ul>\n`;
                    html += `            </div>\n`;
                }
                html += `        </div>\n`;
            }
        } catch (e) {
            console.error('Error parsing line:', e);
        }
    }

    html += `
    </div>
</body>
</html>`;

    fs.writeFileSync(outputPath, html, 'utf8');
    console.log('Successfully generated HTML at', outputPath);
}

generateHtml().catch(console.error);
