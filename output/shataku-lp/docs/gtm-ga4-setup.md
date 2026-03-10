# GTM / GA4 A/Bテスト計測 セットアップガイド

**対象テスト:** サンクスページ A/Bテスト（control vs redesign）

---

## 0. GTMコンテナの構成

本プロジェクトでは GTM コンテナを2つ並行設置しています。

| コンテナ | 用途 | 管理者 |
|----------|------|--------|
| `GTM-5CKQQT2M` | 既存の計測（GA4ページビュー等） | 社内共有 |
| `GTM-TX97GSLP` | A/Bテスト専用（本ガイドの設定対象） | 自身で管理 |

### 新しいGTMコンテナの作成手順

1. [GTM管理画面](https://tagmanager.google.com/) にログイン
2. 右上の **「アカウントを作成」** または既存アカウント内で **「コンテナを作成」** をクリック
3. 以下を入力:

| 項目 | 設定値 |
|------|--------|
| コンテナ名 | `PLEX 福利厚生社宅 - ABテスト` |
| ターゲットプラットフォーム | **ウェブ** |

4. **「作成」** をクリック → コンテナID（`GTM-TX97GSLP`）が発行される
5. コンテナIDをメモする

### layout.tsx へのコンテナ追加

`src/app/layout.tsx` の `<head>` 内に、既存の GTM スニペットの**下**に新コンテナを追加します:

```tsx
{/* 既存のGTMコンテナ（変更しない） */}
<Script id="gtm" strategy="afterInteractive">{`
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-5CKQQT2M');
`}</Script>

{/* A/Bテスト用GTMコンテナ（新規追加） */}
<Script id="gtm-ab" strategy="afterInteractive">{`
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-TX97GSLP');
`}</Script>
```

`<body>` 内の `<noscript>` にも追加します:

```tsx
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5CKQQT2M" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TX97GSLP" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
```

> **重要:** `GTM-TX97GSLP` を実際のコンテナIDに置き換えてください。
>
> **注意:** 2つのコンテナは同じ `dataLayer` を共有します。A/Bテスト用のイベント（`ab_test_impression`, `ab_test_conversion`）は両方のコンテナから見えますが、A/Bテスト用のタグは新コンテナにのみ設定するため、イベントが二重に送信されることはありません。

---

## 前提: dataLayer イベント仕様

サイト側から以下の2種類のイベントが `window.dataLayer` に送信されます。

### インプレッション（バリアント表示時）

```javascript
window.dataLayer.push({
  event: 'ab_test_impression',
  ab_test_name: 'thanks-page',
  ab_test_variant: 'control',  // または 'redesign'
});
```

### コンバージョン（CTAボタンクリック時）

```javascript
window.dataLayer.push({
  event: 'ab_test_conversion',
  ab_test_name: 'thanks-page',
  ab_test_variant: 'control',  // または 'redesign'
});
```

---

## 1. GA4 カスタムディメンションの作成

GA4 側でイベントパラメータをレポートやエクスプロレーションで使えるようにするため、カスタムディメンションを登録します。

### 手順

1. [GA4 管理画面](https://analytics.google.com/) にログイン
2. 左下の **歯車アイコン（管理）** をクリック
3. プロパティ列の **カスタム定義** をクリック
4. **カスタムディメンション** タブを選択し、**「カスタムディメンションを作成」** をクリック

### ディメンション 1: AB Test Name

| 項目 | 設定値 |
|---|---|
| ディメンション名 | `AB Test Name` |
| 範囲 | **イベント** |
| 説明 | A/Bテストの識別名 |
| イベントパラメータ | `ab_test_name` |

5. 入力後 **「保存」** をクリック

### ディメンション 2: AB Test Variant

6. 再度 **「カスタムディメンションを作成」** をクリック

| 項目 | 設定値 |
|---|---|
| ディメンション名 | `AB Test Variant` |
| 範囲 | **イベント** |
| 説明 | A/Bテストのバリアント（control / redesign） |
| イベントパラメータ | `ab_test_variant` |

7. 入力後 **「保存」** をクリック

> **注意:** カスタムディメンションが GA4 レポートに反映されるまで最大24〜48時間かかることがあります。DebugView ではすぐに確認できます。

---

## 2. GTM コンテナ内の設定

以下の設定はすべて **新しいA/Bテスト用コンテナ**（`GTM-TX97GSLP`）で行います。

### 2-1. 変数（Variables）の作成

GTM で dataLayer から値を取得するための変数を2つ作成します。

1. [GTM 管理画面](https://tagmanager.google.com/) にログイン
2. **A/Bテスト用コンテナ** を開く
3. 左メニューの **「変数」** をクリック
4. **ユーザー定義変数** セクションの **「新規」** をクリック

#### 変数 1: DLV - ab_test_name

5. 変数名を `DLV - ab_test_name` に設定
6. **変数の設定** をクリック → 変数タイプ **「データレイヤーの変数」** を選択
7. 以下を入力:

| 項目 | 設定値 |
|---|---|
| データレイヤーの変数名 | `ab_test_name` |
| データレイヤーのバージョン | バージョン 2（デフォルト） |

8. **「保存」** をクリック

#### 変数 2: DLV - ab_test_variant

9. 再度 **「新規」** をクリック
10. 変数名を `DLV - ab_test_variant` に設定
11. **変数の設定** をクリック → 変数タイプ **「データレイヤーの変数」** を選択
12. 以下を入力:

| 項目 | 設定値 |
|---|---|
| データレイヤーの変数名 | `ab_test_variant` |
| データレイヤーのバージョン | バージョン 2（デフォルト） |

13. **「保存」** をクリック

### 2-2. トリガー（Triggers）の作成

dataLayer のイベントを検知するトリガーを2つ作成します。

1. 左メニューの **「トリガー」** をクリック
2. **「新規」** をクリック

#### トリガー 1: CE - ab_test_impression

3. トリガー名を `CE - ab_test_impression` に設定
4. **トリガーの設定** をクリック → トリガータイプ **「カスタム イベント」** を選択
5. 以下を入力:

| 項目 | 設定値 |
|---|---|
| イベント名 | `ab_test_impression` |
| このトリガーの発生場所 | **すべてのカスタム イベント** |

6. **「保存」** をクリック

#### トリガー 2: CE - ab_test_conversion

7. 再度 **「新規」** をクリック
8. トリガー名を `CE - ab_test_conversion` に設定
9. **トリガーの設定** をクリック → トリガータイプ **「カスタム イベント」** を選択
10. 以下を入力:

| 項目 | 設定値 |
|---|---|
| イベント名 | `ab_test_conversion` |
| このトリガーの発生場所 | **すべてのカスタム イベント** |

11. **「保存」** をクリック

### 2-3. Google タグの作成

新コンテナにはまだ GA4 との接続がないため、Google タグを作成します。

1. 左メニューの **「タグ」** をクリック → **「新規」**
2. タグ名を `Google Tag - GA4` に設定
3. **タグの設定** → タグタイプ **「Google タグ」** を選択
4. **タグ ID** に GA4 の測定 ID（`G-T9QDD0JE6H`）を入力
5. **トリガー** → **「All Pages」** を選択
6. **「保存」**

> **注意:** 測定IDは GA4 管理画面 → データストリーム → ウェブストリーム で確認できます。ただし、既存コンテナ（`GTM-5CKQQT2M`）で既にGA4のページビュー計測をしている場合、新コンテナでの Google タグは **不要** です（ページビューが二重計測されるため）。その場合は、手順2-4のGA4イベントタグで測定IDを直接指定してください。

### 2-4. タグ（Tags）の作成

GA4 にイベントを送信するタグを2つ作成します。

1. 左メニューの **「タグ」** をクリック
2. **「新規」** をクリック

#### タグ 1: GA4 - AB Test Impression

3. タグ名を `GA4 - AB Test Impression` に設定
4. **タグの設定** をクリック → タグタイプ **「Google アナリティクス: GA4 イベント」** を選択
5. 以下を入力:

| 項目 | 設定値 |
|---|---|
| 測定ID / Googleタグ | 前の手順で作成した Google タグを選択、または測定 ID を直接入力 |
| イベント名 | `ab_test_impression` |

6. **イベント パラメータ** セクションの **「行を追加」** を2回クリックし、以下を設定:

| パラメータ名 | 値 |
|---|---|
| `ab_test_name` | `{{DLV - ab_test_name}}` |
| `ab_test_variant` | `{{DLV - ab_test_variant}}` |

7. **トリガー** セクションをクリック → **`CE - ab_test_impression`** を選択
8. **「保存」** をクリック

#### タグ 2: GA4 - AB Test Conversion

9. 再度 **「新規」** をクリック
10. タグ名を `GA4 - AB Test Conversion` に設定
11. **タグの設定** をクリック → タグタイプ **「Google アナリティクス: GA4 イベント」** を選択
12. 以下を入力:

| 項目 | 設定値 |
|---|---|
| 測定ID / Googleタグ | 前の手順で作成した Google タグを選択、または測定 ID を直接入力 |
| イベント名 | `ab_test_conversion` |

13. **イベント パラメータ** セクションの **「行を追加」** を2回クリックし、以下を設定:

| パラメータ名 | 値 |
|---|---|
| `ab_test_name` | `{{DLV - ab_test_name}}` |
| `ab_test_variant` | `{{DLV - ab_test_variant}}` |

14. **トリガー** セクションをクリック → **`CE - ab_test_conversion`** を選択
15. **「保存」** をクリック

---

## 3. 設定確認チェックリスト

GTM 内の設定が完了したら、公開前に以下を確認してください。

### A/Bテスト用 GTM コンテナ内の構成一覧

| 種別 | 名前 | 設定内容 |
|---|---|---|
| 変数 | `DLV - ab_test_name` | データレイヤー変数: `ab_test_name` |
| 変数 | `DLV - ab_test_variant` | データレイヤー変数: `ab_test_variant` |
| トリガー | `CE - ab_test_impression` | カスタムイベント: `ab_test_impression` |
| トリガー | `CE - ab_test_conversion` | カスタムイベント: `ab_test_conversion` |
| タグ | `Google Tag - GA4` | Google タグ: 測定ID（※既存で計測済みなら不要） |
| タグ | `GA4 - AB Test Impression` | GA4イベント → トリガー: CE - ab_test_impression |
| タグ | `GA4 - AB Test Conversion` | GA4イベント → トリガー: CE - ab_test_conversion |

---

## 4. 検証手順

### 4-1. GTM プレビューモードでの確認

1. GTM 管理画面右上の **「プレビュー」** をクリック
2. サイトの URL を入力して **「Connect」** をクリック
3. 別タブでサイトが開き、GTM Tag Assistant が接続される
4. サンクスページに遷移し、以下を確認:

#### インプレッション確認

5. Tag Assistant の左パネルに **`ab_test_impression`** イベントが表示されることを確認
6. そのイベントをクリック → **「Tags Fired」** セクションに **`GA4 - AB Test Impression`** が表示されることを確認
7. **「Variables」** タブを開き、以下の値が正しいことを確認:
   - `DLV - ab_test_name` = `thanks-page`
   - `DLV - ab_test_variant` = `control` または `redesign`

#### コンバージョン確認

8. サンクスページの CTA ボタンをクリック
9. Tag Assistant の左パネルに **`ab_test_conversion`** イベントが表示されることを確認
10. そのイベントをクリック → **「Tags Fired」** セクションに **`GA4 - AB Test Conversion`** が表示されることを確認
11. **「Variables」** タブで `ab_test_name` と `ab_test_variant` の値が正しいことを確認

### 4-2. GA4 DebugView での確認

1. GA4 管理画面を開く
2. 左メニューの **管理** → **データの表示** → **DebugView** をクリック
3. GTM プレビューモードで接続したブラウザからのイベントが表示される
4. 以下を確認:

| 確認項目 | 期待値 |
|---|---|
| `ab_test_impression` イベントが表示される | タイムラインにイベントカードが表示 |
| イベントをクリック → パラメータに `ab_test_name` がある | 値: `thanks-page` |
| イベントをクリック → パラメータに `ab_test_variant` がある | 値: `control` or `redesign` |
| `ab_test_conversion` イベントが表示される | CTAクリック後にイベントカードが表示 |
| コンバージョンイベントのパラメータも同様に正しい | 上記と同じ |

> **ヒント:** DebugView にイベントが表示されない場合は、ブラウザの広告ブロッカーを無効にしてください。Chrome の場合は GTM プレビューモードを使用すると自動的にデバッグモードが有効になります。

### 4-3. GA4 リアルタイムレポートでの確認

1. GA4 左メニューの **レポート** → **リアルタイム** をクリック
2. **「イベント数（イベント名別）」** カードで以下が表示されることを確認:
   - `ab_test_impression`
   - `ab_test_conversion`
3. イベント名をクリックし、**パラメータキー** `ab_test_variant` を選択して値の内訳を確認

---

## 5. GTM の公開

検証が完了したら、GTM コンテナを公開します。

1. GTM 管理画面右上の **「送信」** をクリック
2. バージョン名に `AB Test - Thanks Page（impression + conversion）` と入力
3. バージョンの説明に以下を記載:
   ```
   サンクスページ A/Bテスト用の計測設定を追加
   - ab_test_impression: バリアント表示イベント
   - ab_test_conversion: CTAクリックイベント
   - パラメータ: ab_test_name, ab_test_variant
   ```
4. **「公開」** をクリック

---

## 6. GA4 探索レポートで CVR を比較する

データが蓄積されたら（最低でも公開後24〜48時間）、探索レポートでバリアント別の CVR を比較します。

### レポート作成手順

1. GA4 左メニューの **「探索」** をクリック
2. **「空白」** テンプレートを選択して新規作成
3. レポート名を `AB Test - Thanks Page CVR` に設定

### 変数パネルの設定

4. **ディメンション** セクションの **「＋」** をクリック
5. 検索窓に `AB Test` と入力 → **「AB Test Variant」** にチェック → **「インポート」**
6. **指標** セクションの **「＋」** をクリック
7. **「イベント数」** にチェック → **「インポート」**

### タブの設定

8. **手法** が **「自由形式」** になっていることを確認（デフォルト）
9. **行** に `AB Test Variant` をドラッグ＆ドロップ
10. **値** に `イベント数` をドラッグ＆ドロップ
11. **フィルタ** を設定して対象テストのデータに絞り込む:
    - **「フィルタ」** セクションの **「＋」** をクリック
    - ディメンション: `AB Test Name`
    - 条件: **完全一致**
    - 値: `thanks-page`
    - **「適用」** をクリック

### イベント別に分けて表示する

12. **変数パネル** の **セグメント** セクションで **「＋」** をクリック
13. **「イベントセグメント」** を選択
14. セグメント名: `AB Impression` → 条件: イベント名 = `ab_test_impression` → **「保存して適用」**
15. 同様にもう1つ作成: セグメント名: `AB Conversion` → 条件: イベント名 = `ab_test_conversion` → **「保存して適用」**
16. 両方のセグメントを **列** にドラッグ＆ドロップ

これにより、以下のようなテーブルが表示されます:

| AB Test Variant | AB Impression（イベント数） | AB Conversion（イベント数） |
|---|---|---|
| control | 520 | 26 |
| redesign | 480 | 36 |

### CVR の算出

GA4 の探索レポートでは直接「割り算」の指標を作成できないため、スプレッドシートにエクスポートして計算します。

17. レポート右上の **エクスポートアイコン** → **「Google スプレッドシート」** を選択
18. スプレッドシートに CVR 列を追加:
    ```
    CVR = Conversion数 / Impression数 × 100
    ```

| バリアント | Impression | Conversion | CVR |
|---|---|---|---|
| control | 520 | 26 | 5.0% |
| redesign | 480 | 36 | 7.5% |

### 統計的有意性の確認

各バリアント最低100インプレッションが集まったら、以下で有意差を確認:

- **自動:** `npx tsx scripts/ab-test-report.ts` を実行（Fisher正確検定で自動判定）
- **手動:** [ABテスト計算ツール（Evan Miller）](https://www.evanmiller.org/ab-testing/chi-squared.html) に Successes / Trials を入力

p値が 0.05 未満であれば統計的に有意と判断します。

---

## トラブルシューティング

| 症状 | 原因と対処 |
|---|---|
| GTM プレビューでイベントが表示されない | ブラウザコンソールで `dataLayer` を確認。A/Bテスト用コンテナのプレビューを使っているか確認 |
| タグが「Tags Not Fired」になる | トリガーのイベント名のスペルミスを確認（大文字小文字も区別される） |
| GA4 DebugView に表示されない | 広告ブロッカーを無効化 / GTMプレビューモードを使用 |
| カスタムディメンションがレポートに出ない | 作成後24〜48時間待つ / イベントパラメータ名のスペルミスを確認 |
| バリアント値が `undefined` になる | dataLayer.push のタイミングを確認（GTM読み込み前に push されている可能性） |
| リアルタイムにイベントは出るが探索で出ない | データ処理に24〜48時間かかるため待つ |
| イベントが二重に送信される | 既存コンテナ（GTM-5CKQQT2M）に同名のタグがないか確認。A/Bテスト用タグは新コンテナにのみ設定する |
