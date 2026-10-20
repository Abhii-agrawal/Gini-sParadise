const nodemailer = require('nodemailer');

function getEmailConfig() {
  return {
    adminEmail: process.env.ADMIN_EMAIL || 'abhishekagrawal031@gmail.com',
    adminName: process.env.ADMIN_NAME || 'Abhishek',
    senderName: process.env.SENDER_NAME || "Gini's SugarCloud Boutique 🧁",
    smtp: {
      enabled: true,
      service: process.env.SMTP_SERVICE || 'gmail',
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER || 'abhishekagrawal031@gmail.com',
        pass: process.env.SMTP_PASS || 'yvhrtvsjuubwgkdb'
      }
    },
    web3forms: {
      enabled: !!process.env.WEB3FORMS_ACCESS_KEY,
      accessKey: process.env.WEB3FORMS_ACCESS_KEY || ''
    }
  };
}

function generateOrderEmailHtml(order, config) {
  const items = Array.isArray(order.items) ? order.items : [];
  const totalTreats = items.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 1), 0);

  const itemsHtml = items.map((item) => {
    const icon = item.icon || '🍰';
    const name = item.name || 'Artisan Treat';
    const variant = item.variant || 'Standard';
    const qty = item.qty || 1;
    return (
      '<tr style="border-bottom: 1px solid #f1f5f9;">' +
        '<td style="padding: 14px 12px; font-size: 26px; width: 44px; text-align: center; vertical-align: middle;">' + icon + '</td>' +
        '<td style="padding: 14px 12px; vertical-align: middle;">' +
          '<div style="font-weight: 700; color: #0f172a; font-size: 15px;">' + name + '</div>' +
          '<div style="color: #0284c7; font-size: 13px; font-weight: 500; margin-top: 3px;">✨ Variant: ' + variant + '</div>' +
        '</td>' +
        '<td style="padding: 14px 12px; text-align: right; vertical-align: middle;">' +
          '<span style="display: inline-block; background: #e0f2fe; color: #0369a1; font-weight: 800; font-size: 13px; padding: 5px 12px; border-radius: 9999px; border: 1px solid #bae6fd;">× ' + qty + '</span>' +
        '</td>' +
      '</tr>'
    );
  }).join('');

  const noteBlock = order.note ? (
    '<div style="background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 0 12px 12px 0; padding: 16px 18px; margin: 24px 0;">' +
      '<div style="color: #b45309; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;">💌 Special Baker\'s Note from Gini</div>' +
      '<div style="color: #78350f; font-style: italic; font-size: 14px; line-height: 1.6;">“' + order.note + '”</div>' +
    '</div>'
  ) : '';

  return '<!DOCTYPE html>' +
'<html lang="en">' +
'<head><meta charset="UTF-8"><title>🧁 SugarCloud Order Alert: ' + order.id + '</title></head>' +
'<body style="margin: 0; padding: 24px 12px; background: #f0f9ff; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">' +
  '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 35px rgba(56, 189, 248, 0.18); border: 1px solid #bae6fd;">' +
    '<tr>' +
      '<td style="background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%); padding: 32px 24px; text-align: center; color: #ffffff;">' +
        '<div style="font-size: 32px; margin-bottom: 6px;">🧁 ✨ 🧺</div>' +
        '<h1 style="margin: 0 0 6px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">Gini\'s SugarCloud Boutique</h1>' +
        '<p style="margin: 0; font-size: 14px; opacity: 0.95; font-weight: 500;">A New Treat Order Has Been Packed with Love! ♡</p>' +
      '</td>' +
    '</tr>' +
    '<tr>' +
      '<td style="padding: 28px 24px;">' +
        '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px 18px; margin-bottom: 24px;">' +
          '<tr>' +
            '<td style="font-size: 13px; color: #64748b; padding: 4px 8px;">Order Number<div style="font-size: 15px; font-weight: 800; color: #0284c7; margin-top: 2px;">#' + order.id + '</div></td>' +
            '<td style="font-size: 13px; color: #64748b; padding: 4px 8px;">Placed At<div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 2px;">' + (order.timestamp || new Date().toLocaleString()) + '</div></td>' +
            '<td style="font-size: 13px; color: #64748b; padding: 4px 8px; text-align: right;">Status<div style="font-size: 13px; font-weight: 800; color: #059669; margin-top: 2px;">● Accepted & Packed</div></td>' +
          '</tr>' +
        '</table>' +
        '<p style="font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 20px 0;">Hey <strong>' + (config.adminName || 'Abhishek') + '</strong>! Gini just finalized an order from the <strong>SugarCloud Bakery Cart</strong>! Here are all the delicious sweet treats she selected:</p>' +
        '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin: 16px 0 24px 0; background: #ffffff; border: 1px solid #f1f5f9; border-radius: 12px; overflow: hidden;">' +
          '<thead>' +
            '<tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">' +
              '<th style="padding: 12px; text-align: left; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;" colspan="2">Sweet Treat</th>' +
              '<th style="padding: 12px; text-align: right; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Quantity</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' + itemsHtml + '</tbody>' +
        '</table>' +
        noteBlock +
        '<div style="background: #f0fdf4; border: 1px dashed #86efac; border-radius: 14px; padding: 16px 20px; text-align: center; margin-top: 24px;">' +
          '<div style="font-size: 14px; font-weight: 700; color: #15803d;">✨ Total Sweet Items: ' + totalTreats + ' treats</div>' +
          '<div style="font-size: 12px; color: #16a34a; margin-top: 4px;">Order dispatched directly from Gini\'s Paradise Web Experience ♡</div>' +
        '</div>' +
      '</td>' +
    '</tr>' +
    '<tr>' +
      '<td style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">' +
        'Sent with love by <strong>' + (config.senderName || "Gini's SugarCloud Boutique 🧁") + '</strong><br>' +
        'Celebrating Shubhangini\'s Birthday ✨' +
      '</td>' +
    '</tr>' +
  '</table>' +
'</body>' +
'</html>';
}

async function dispatchOrderEmail(order, html, config) {
  let emailSent = false;
  let deliveryMethod = 'none';
  let errorMsg = null;

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
        from: '"' + (config.senderName || 'SugarCloud Boutique') + '" <' + config.smtp.auth.user + '>',
        to: config.adminEmail,
        subject: '🧁 SugarCloud Order Alert: #' + order.id + " from Gini's Basket! ♡",
        html: html
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('[Vercel Serverless] Email sent successfully via SMTP! Message ID:', info.messageId);
      emailSent = true;
      deliveryMethod = 'smtp';
    } catch (smtpErr) {
      console.error('[Vercel Serverless] SMTP dispatch failed:', smtpErr.message);
      errorMsg = 'SMTP error: ' + smtpErr.message;
    }
  }

  if (!emailSent && config.web3forms && config.web3forms.enabled && config.web3forms.accessKey) {
    try {
      const itemsSummary = (order.items || []).map(i => i.qty + 'x ' + i.name + ' (' + (i.variant || 'Standard') + ')').join(', ');
      const messageBody = 'Order ID: ' + order.id + '\nPlaced At: ' + order.timestamp + '\nItems:\n' + itemsSummary + '\n\nBaker\'s Note: ' + (order.note || '(none)');

      const w3Res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: config.web3forms.accessKey,
          subject: '🧁 SugarCloud Order Alert: #' + order.id + " from Gini's Basket! ♡",
          from_name: config.senderName || "SugarCloud Boutique 🧁",
          to_email: config.adminEmail,
          message: messageBody
        })
      });

      const w3Data = await w3Res.json();
      if (w3Data.success) {
        console.log('[Vercel Serverless] Email sent successfully via Web3Forms API!');
        emailSent = true;
        deliveryMethod = 'web3forms';
      } else {
        errorMsg = 'Web3Forms error: ' + w3Data.message;
      }
    } catch (w3Err) {
      errorMsg = 'Web3Forms dispatch failed: ' + w3Err.message;
    }
  }

  return { emailSent, deliveryMethod, errorMsg };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  try {
    let order = req.body;
    if (typeof order === 'string') {
      try {
        order = JSON.parse(order);
      } catch (e) {}
    }

    if (!order || !order.id) {
      return res.status(400).json({ success: false, error: 'Invalid order payload' });
    }

    const config = getEmailConfig();
    const emailHtml = generateOrderEmailHtml(order, config);
    const result = await dispatchOrderEmail(order, emailHtml, config);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      recipient: config.adminEmail,
      emailSent: result.emailSent,
      deliveryMethod: result.deliveryMethod,
      error: result.errorMsg
    });
  } catch (err) {
    console.error('[Vercel Serverless Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
