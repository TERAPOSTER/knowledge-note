import mustache from 'mustache';
// Viteのルールとして、インポートする対象のファイルをそのまま取得するためには相対パスの末尾に"?raw"を付与する必要がある
// この場合、テンプレートのHTMLファイルをそのまま取得したいので"?raw"を末尾に付与している
// 参照: https://ja.vite.dev/guide/assets.html#importing-asset-as-string
import html from '../../templates/articles/id.html?raw';
// HTMLを無害化（サニタイズ）するライブラリをインポート
import DOMPurify from 'dompurify';
// Markdown形式の文字列をHTML形式の文字列にするライブラリをインポート
import { parse } from 'marked';
/**
 * 記事新規作成時の処理の関数
 */
export const articlesId = ({ id }) => {
    const app = document.querySelector('#app');
    
    // fetchでAPIから記事データを取得
    const fetchArticleData = async () => {
        try {
            // 実際のAPIのURL（UUIDに基づいて記事を取得）
            const response = await fetch(`/api/v1/articles/${id}`);
            
            if (!response.ok) {
                throw new Error('記事データの取得に失敗しました');
            }

            const data = await response.json();
            
            // isSuccessがtrueの場合にデータを処理
            if (!data.isSuccess) {
                throw new Error('記事が存在しません');
            }

            const article = data.item; // articleデータは`item`の中にある

            // 作成日時・更新日時をフォーマットする関数
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            };

            // 記事データが取得できたらテンプレートをレンダリング
            app.innerHTML = mustache.render(html, {
                title: article.title || 'タイトル未設定',
                createdAt: article.createdAt,
                displayCreatedAt: () => formatDate(article.createdAt),
                updatedAt: article.updatedAt,
                displayUpdatedAt: () => formatDate(article.updatedAt),
                user: {
                    id: article.user.id,
                    username: article.user.username,
                },
                // MarkdownをHTMLに変換してサニタイズ
                body: DOMPurify.sanitize(parse(article.body)),
            });
        } catch (error) {
            console.error(error);
            app.innerHTML = '<p>記事の読み込みに失敗しました。</p>';
        }
    };

    // 記事データを取得して表示
    fetchArticleData();

    // 追加の処理があればここで記述
    return () => {
        // 他のページ遷移後の処理等を記述可能
    };
// export const articlesId = ({ id }) => {
//     const app = document.querySelector('#app');
//     // templates/articles/id.html を <div id="app"></div> 要素内に出力する
//     app.innerHTML = mustache.render(html, {
//         title: 'テストタイトル',
//         createdAt: '2024-12-16T02:59:58.271Z',
//         displayCreatedAt: function () {
//             /* @todo 上の行にある createdAt の値をJSのDateオブジェクトを用いて
//             2025/01/19 のようなフォーマットに変換した文字列をセット */
//             console.log(this);
//             return '2024/12/16';
//         },
//         updatedAt: '2024-12-16T02:59:58.271Z',
//         displayUpdatedAt: function () {
//             /* @todo 上の行にある updatedAt の値をJSのDateオブジェクトを用いて
//             2025/01/19 のようなフォーマットに変換した文字列をセット */
//             console.log(this);
//             return '2024/12/16';
//         },
//         user: {
//             id: '94fbd3f5-e175-4817-8da9-9ccac2a0a956',
//             username: '@example',
//         },
//         body: '<h1>見出し</h1><p>テキストテキストテキスト</p>'
//     });
//     // このページ /articles/:id から遷移する際に実行する処理
//     return () => {
//     };
};