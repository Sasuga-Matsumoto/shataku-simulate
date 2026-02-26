function doPost(e) {
  var sheet = SpreadsheetApp.openById('1oegTw6XjziBtnx1xBEGWiF-4GX03M7F90oa5JrACqL0').getSheetByName("問い合わせ");
  var data = JSON.parse(e.postData.contents);

  // スプレッドシートへの転記
  sheet.appendRow([
    new Date(),
    data.company,
    data.lastName,
    data.firstName,
    data.email,
    data.phone,
    data.employees,
    data.department,
    data.position,
    data.inquiry,
    data.formType
  ]);

  // 自動返信メール送信
  try {
    if (data.formType === '資料請求') {
      sendDocumentRequestReply(data);
    } else if (data.formType === 'お問い合わせ') {
      sendContactReply(data);
    }
    Logger.log('メール送信成功: ' + data.email + ' / formType: ' + data.formType);
  } catch (err) {
    Logger.log('メール送信エラー: ' + err.message);
  }

  return ContentService.createTextOutput(JSON.stringify({result: "success"}))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 資料請求の自動返信メール
 */
function sendDocumentRequestReply(data) {
  var subject = '【PLEX】資料請求ありがとうございます';
  var body = data.lastName + ' ' + data.firstName + ' 様\n\n'
    + 'この度は、PLEX借上社宅サービスの資料をご請求いただき、\n'
    + '誠にありがとうございます。\n\n'
    + '下記URLより資料をご覧いただけます。\n\n'
    + '▼ 資料閲覧URL\n'
    + 'https://docs.google.com/presentation/d/1IgICrVcJYUgEpDKx8xcnkSyHdQLPOltPeyDRV52EwsY/edit?usp=sharing\n\n'
    + 'ご不明な点がございましたら、お気軽にお問い合わせください。\n\n'
    + '─────────────────────\n'
    + '株式会社プレックス 福利厚生社宅事業部\n'
    + 'TEL：080-6728-2695\n'
    + 'Mail：shataku@plex.co.jp\n'
    + '─────────────────────';

  GmailApp.sendEmail(data.email, subject, body, {
    from: 'shataku@plex.co.jp',
    name: '株式会社プレックス 借上社宅サービス'
  });
}

/**
 * お問い合わせの自動返信メール
 */
function sendContactReply(data) {
  var subject = '【PLEX】お問い合わせありがとうございます';
  var body = data.lastName + ' ' + data.firstName + ' 様\n\n'
    + 'この度は、PLEX借上社宅サービスへお問い合わせいただき、\n'
    + '誠にありがとうございます。\n\n'
    + '以下の内容でお問い合わせを承りました。\n'
    + '担当者より改めてご連絡いたしますので、\n'
    + '今しばらくお待ちくださいませ。\n\n'
    + '【お問い合わせ内容】\n'
    + data.inquiry + '\n\n'
    + 'ご不明な点がございましたら、お気軽にお問い合わせください。\n\n'
    + '─────────────────────\n'
    + '株式会社プレックス 福利厚生社宅事業部\n'
    + 'TEL：080-6728-2695\n'
    + 'Mail：shataku@plex.co.jp\n'
    + '─────────────────────';

  GmailApp.sendEmail(data.email, subject, body, {
    from: 'shataku@plex.co.jp',
    name: '株式会社プレックス 借上社宅サービス'
  });
}
