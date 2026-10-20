const http = require('http');
const fs = require('fs');
const path = require('path');
let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  console.log('nodemailer not yet loaded, will use fallback archiving');
}

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.json': 'application/json',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.mpeg': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg'
};

// Helper: load current email configuration
function loadEmailConfig() {
  const configPath = path.join(__dirname, 'email-config.json');
  try {
    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading email-config.json:', err.message);
  }
  return {
    adminEmail: 'abhishekagrawal031@gmail.com',
    adminName: 'Abhishek',
    senderName: "Gini's SugarCloud Boutique 🧁",
    smtp: { enabled: false },
    web3forms: { enabled: false }
  };
}

// Generate luxury HTML email template matching SugarCloud pastel aesthetics
function generateOrderEmailHtml(order, config) {
  const items = Array.isArray(order.items) ? order.items : [];
  const totalTreats = items.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 1), 0);

  const itemsHtml = items.map((item) => {
    const icon = item.icon || '🍰';
    const name = item.name || 'Artisan Treat';
    const variant = item.variant || 'Standard';
    const qty = item.qty || 1;
    return `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 14px 12px; font-size: 26px; width: 44px; text-align: center; vertical-align: middle;">
          ${icon}
        </td>
        <td style="padding: 14px 12px; vertical-align: middle;">
          <div style="font-weight: 700; color: #0f172a; font-size: 15px;">${name}</div>
          <div style="color: #0284c7; font-size: 13px; font-weight: 500; margin-top: 3px;">✨ Variant: ${variant}</div>
        </td>
        <td style="padding: 14px 12px; text-align: right; vertical-align: middle;">
          <span style="display: inline-block; background: #e0f2fe; color: #0369a1; font-weight: 800; font-size: 13px; padding: 5px 12px; border-radius: 9999px; border: 1px solid #bae6fd;">
            × ${qty}
          </span>
        </td>
      </tr>
    `;
  }).join('');

  const noteBlock = order.note ? `
    <div style="background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 0 12px 12px 0; padding: 16px 18px; margin: 24px 0;">
      <div style="color: #b45309; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;">
        💌 Special Baker's Note from Gini
      </div>
      <div style="color: #78350f; font-style: italic; font-size: 14px; line-height: 1.6;">
        “${order.note}”
      </div>
    </div>
  ` : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>🧁 SugarCloud Order Alert: ${order.id}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background: #f0f9ff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 35px rgba(56, 189, 248, 0.18); border: 1px solid #bae6fd;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
        <div style="font-size: 32px; margin-bottom: 6px;">🧁 ✨ 🧺</div>
        <h1 style="margin: 0 0 6px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">
          Gini's SugarCloud Boutique
        </h1>
        <p style="margin: 0; font-size: 14px; opacity: 0.95; font-weight: 500;">
          A New Treat Order Has Been Packed with Love! ♡
        </p>
      </td>
    </tr>

    <!-- Content Body -->
    <tr>
      <td style="padding: 28px 24px;">
        <!-- Meta Details Pill -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px 18px; margin-bottom: 24px;">
          <tr>
            <td style="font-size: 13px; color: #64748b; padding: 4px 8px;">
              Order Number
              <div style="font-size: 15px; font-weight: 800; color: #0284c7; margin-top: 2px;">
                #${order.id}
              </div>
            </td>
            <td style="font-size: 13px; color: #64748b; padding: 4px 8px;">
              Placed At
              <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 2px;">
                ${order.timestamp || new Date().toLocaleString()}
              </div>
            </td>
            <td style="font-size: 13px; color: #64748b; padding: 4px 8px; text-align: right;">
              Status
              <div style="font-size: 13px; font-weight: 800; color: #059669; margin-top: 2px;">
                ● Accepted & Packed
              </div>
            </td>
          </tr>
        </table>

        <!-- Greeting -->
        <p style="font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 20px 0;">
          Hey <strong>${config.adminName || 'Abhishek'}</strong>, Gini just packed a gift box in <strong>Gini's SugarCloud</strong>! Here is the full breakdown of everything requested in her basket:
        </p>

        <!-- Treats Table -->
        <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #0369a1; margin-bottom: 10px;">
          🧺 Basket Treats Breakdown (${totalTreats} Total Items)
        </div>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 20px;">
          <thead>
            <tr style="background: #f0f9ff; border-bottom: 2px solid #bae6fd;">
              <th style="padding: 10px 12px; text-align: center; font-size: 12px; color: #0369a1; text-transform: uppercase; width: 44px;">Icon</th>
              <th style="padding: 10px 12px; text-align: left; font-size: 12px; color: #0369a1; text-transform: uppercase;">Treat & Variant</th>
              <th style="padding: 10px 12px; text-align: right; font-size: 12px; color: #0369a1; text-transform: uppercase;">Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Note Block -->
        ${noteBlock}

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 14px 18px; text-align: center; margin-top: 24px;">
          <span style="font-size: 14px; color: #166534; font-weight: 600;">
            ✨ Ready for the head baker to prepare with maximum warmth and sweetness! 🎂
          </span>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.6;">
        Delivered automatically to <strong>${config.adminEmail}</strong> from Gini's SugarCloud Bakery.<br>
        Crafted with love for Gini's Birthday Celebration ♡
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Save order to local orders archive (fail-safe for offline or before credentials entered)
function archiveOrderLocally(order, html) {
  try {
    const ordersDir = path.join(__dirname, 'orders');
    if (!fs.existsSync(ordersDir)) {
      fs.mkdirSync(ordersDir, { recursive: true });
    }

    // Save individual HTML receipt
    const htmlFile = path.join(ordersDir, `order-${order.id}.html`);
    fs.writeFileSync(htmlFile, html, 'utf8');

    // Append to orders.json history
    const jsonFile = path.join(ordersDir, 'orders.json');
    let ordersList = [];
    if (fs.existsSync(jsonFile)) {
      try {
        ordersList = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
      } catch (e) {
        ordersList = [];
      }
    }
    ordersList.unshift(order);
    fs.writeFileSync(jsonFile, JSON.stringify(ordersList, null, 2), 'utf8');

    console.log(`[SugarCloud] Order #${order.id} archived locally to: ${htmlFile}`);
    return `/orders/order-${order.id}.html`;
  } catch (err) {
    console.error('[SugarCloud] Error archiving order locally:', err);
    return null;
  }
}

// Dispatch email via Nodemailer SMTP or Web3Forms
async function dispatchOrderEmail(order, html, config) {
  let emailSent = false;
  let deliveryMethod = 'archived_only';
  let errorMsg = null;

  // 1. Try Nodemailer if SMTP configured
  if (nodemailer && config.smtp && config.smtp.enabled && config.smtp.auth && config.smtp.auth.pass) {
    try {
      const transporter = nodemailer.createTransport({
        service: config.smtp.service || undefined,
        host: config.smtp.host || undefined,
        port: config.smtp.port || 465,
        secure: config.smtp.secure !== false,
        auth: {
          user: config.smtp.auth.user,
          pass: config.smtp.auth.pass
        }
      });

      const mailOptions = {
        from: `"${config.senderName || 'SugarCloud Boutique'}" <${config.smtp.auth.user}>`,
        to: config.adminEmail,
        subject: `🧁 SugarCloud Order Alert: #${order.id} from Gini's Basket! ♡`,
        html: html
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[SugarCloud] Email sent successfully via SMTP! Message ID: ${info.messageId}`);
      emailSent = true;
      deliveryMethod = 'smtp';
    } catch (err) {
      console.error('[SugarCloud] SMTP dispatch failed:', err.message);
      errorMsg = `SMTP error: ${err.message}`;
    }
  }

  // 2. Try Web3Forms if enabled and not yet sent
  if (!emailSent && config.web3forms && config.web3forms.enabled && config.web3forms.accessKey) {
    try {
      const itemsSummary = (order.items || []).map(i => `${i.qty}x ${i.name} (${i.variant || 'Standard'})`).join(', ');
      const messageBody = `Order ID: ${order.id}\nPlaced At: ${order.timestamp}\nItems:\n${itemsSummary}\n\nBaker's Note: ${order.note || '(none)'}`;

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: config.web3forms.accessKey,
          subject: `🧁 SugarCloud Order Alert: #${order.id} from Gini's Basket! ♡`,
          from_name: config.senderName || "SugarCloud Boutique 🧁",
          to_email: config.adminEmail,
          message: messageBody
        })
      });

      const result = await res.json();
      if (result.success) {
        console.log('[SugarCloud] Email sent successfully via Web3Forms API!');
        emailSent = true;
        deliveryMethod = 'web3forms';
      } else {
        console.error('[SugarCloud] Web3Forms API error:', result.message);
        errorMsg = `Web3Forms error: ${result.message}`;
      }
    } catch (err) {
      console.error('[SugarCloud] Web3Forms dispatch failed:', err.message);
      errorMsg = `Web3Forms error: ${err.message}`;
    }
  }

  return { emailSent, deliveryMethod, errorMsg };
}

const server = http.createServer(async (req, res) => {
  let reqUrl = req.url.split('?')[0];

  // API Route: Handle Order Email Dispatch
  if (req.method === 'POST' && reqUrl === '/api/send-order-email') {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', async () => {
      try {
        const bodyStr = Buffer.concat(chunks).toString('utf8');
        const order = JSON.parse(bodyStr || '{}');

        if (!order || !order.id) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Invalid order payload' }));
          return;
        }

        const config = loadEmailConfig();
        const emailHtml = generateOrderEmailHtml(order, config);

        // Always archive locally for fail-safe 100% receipt retention
        const archiveUrl = archiveOrderLocally(order, emailHtml);

        // Attempt real-time email dispatch
        const dispatchResult = await dispatchOrderEmail(order, emailHtml, config);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          orderId: order.id,
          archiveUrl: archiveUrl,
          recipient: config.adminEmail,
          emailSent: dispatchResult.emailSent,
          deliveryMethod: dispatchResult.deliveryMethod,
          error: dispatchResult.errorMsg
        }));
      } catch (err) {
        console.error('[SugarCloud API Error]:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // Static File Serving
  if (reqUrl === '/') reqUrl = '/index.html';
  const filePath = path.join(__dirname, decodeURIComponent(reqUrl));

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    let contentType = MIME_TYPES[ext] || 'application/octet-stream';
    if (!ext && /gelato$/i.test(filePath)) {
      contentType = 'image/avif';
    }
    const totalSize = stats.size;
    const range = req.headers.range;

    const isMedia = ['.mp4', '.mp3', '.m4a', '.wav', '.ogg'].includes(ext);
    const cacheHeader = isMedia ? 'public, max-age=604800, immutable' : 'no-cache';

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
      const chunkSize = (end - start) + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
        'Cache-Control': cacheHeader
      });
      if (req.method === 'HEAD') { res.end(); return; }
      const stream = fs.createReadStream(filePath, { start, end });
      req.on('close', () => { stream.destroy(); });
      stream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': totalSize,
        'Accept-Ranges': 'bytes',
        'Content-Type': contentType,
        'Cache-Control': cacheHeader
      });
      if (req.method === 'HEAD') { res.end(); return; }
      const stream = fs.createReadStream(filePath);
      req.on('close', () => { stream.destroy(); });
      stream.pipe(res);
    }
  });
});

server.listen(PORT, () => {
  console.log(`SugarCloud Server running at http://localhost:${PORT}`);
});
