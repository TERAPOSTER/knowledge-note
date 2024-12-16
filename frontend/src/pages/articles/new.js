import mustache from 'mustache';
// Viteのルールとして、インポートする対象のファイルをそのまま取得するためには相対パスの末尾に"?raw"を付与する必要がある
// この場合、テンプレートのHTMLファイルをそのまま取得したいので"?raw"を末尾に付与している
// 参照: https://ja.vite.dev/guide/assets.html#importing-asset-as-string
import html from '../../templates/articles/new.html?raw';

// 当授業ではCSRF攻撃に対して脆弱なコードとなっていますが、実装が煩雑になるので考慮せずに実装しますが
// 実際にログインを伴うサイト等でフォーム送信などを行う処理にはCSRF攻撃に対する対策CSRFトークンも含めるなどの対策を実施してください
// 参考: https://developer.mozilla.org/ja/docs/Glossary/CSRF

/**
 * 記事新規作成時の処理の関数
 */
import { navigate } from '../../utils/router';
export const articlesNew = () => {
  const app = document.querySelector('#app');
  // templates/articles/new.html を <div id="app"></div> 要素内に出力する
  app.innerHTML = mustache.render(html, {});


  // TODO: new.htmlにかかれているHTMLに入力の変更があったら画面右側のプレビューの内容を入力した内容に応じたものに変換する
  // 処理...
  const textarea = document.getElementById('editor-textarea');  // Markdown入力エリア
  const previewArea = document.getElementById('preview-area');  // プレビュー表示エリア

  // テキストエリアに入力されたMarkdownをプレビューエリアに反映
  console.log(textarea);
  textarea.addEventListener('input', (event) => {
    const markdownText = event.target.value;  // 入力されたMarkdownテキスト

    // MarkdownをHTMLに変換し、DOMPurifyでサニタイズ
    const htmlText = DOMPurify.sanitize(parse(markdownText));

    // プレビューエリアに変換したHTMLを表示
    previewArea.innerHTML = htmlText;
  });

  
};
  // "公開" ボタンを押下された際にPOSTメソッドで /api/v1/articles に対してAPI通信を fetch で送信する
  // フォームが送信された際の処理（公開ボタン）
  const form = document.getElementById('articles-new-form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();  // フォーム送信を防ぐ

    const title = form.querySelector('input[name="title"]').value;  // タイトル
    const body = textarea.value;  // Markdown本文

    // APIにPOSTリクエストを送信
    const response = await fetch('/api/v1/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, body }),
    });

    if (response.ok) {
      console.log('記事が作成されました！');
      

      // 呼び出した関数を実行する。引数は遷移したいパスをスラッシュから入力
      navigate('/mypage');
    } else {
      console.error('記事の作成に失敗しました。');
    }
  });

/**この下にPREVIEW関連の実装を試しにしてみる */
import { parse } from 'marked';
import DOMPurify from 'dompurify';

const markdownText = `
# 見出し

- 箇条書き1
- 箇条書き2
`;

/**
 * 以下のようなHTMLが得られるはず
<h1>見出し</h1>
<ul>
<li>箇条書き1</li>
<li>箇条書き2</li>
</ul>
 */
const htmlText = DOMPurify.sanitize(parse(markdownText));
console.log(htmlText);

