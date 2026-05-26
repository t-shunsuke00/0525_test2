/**
 * 高校数学Ⅰ 個別最適化学習Webアプリケーション (math_problems.js)
 * 問題データベース、ランダム問題生成、および解答の全角半角名寄せ判定ロジック
 */

const MathProblems = (function() {
  
  // 1. 章と単元（節）の構造定義
  const structure = {
    "expressions": {
      name: "数と式",
      sections: {
        "factorization": "展開と因数分解",
        "inequalities": "実数と一次不等式"
      }
    },
    "quadratic": {
      name: "2次関数",
      sections: {
        "graphs": "2次関数のグラフ",
        "equations": "2次方程式と不等式"
      }
    },
    "trigonometry": {
      name: "図形と計量",
      sections: {
        "ratios": "三角比の基本",
        "theorems": "正弦定理・余弦定理"
      }
    },
    "data_analysis": {
      name: "データの分析",
      sections: {
        "stats": "代表値と分散",
        "correlation": "相関関係"
      }
    }
  };

  // 2. 全角から半角への標準化関数（マイナスやカンマも名寄せ）
  function normalizeInput(str) {
    if (!str) return "";
    return str
      // 全角の数字を半角に変換
      .replace(/[０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
      })
      // 各種全角マイナス・ハイフン記号を半角マイナス '-' に統一
      .replace(/[－ー—–‐ー−]/g, "-")
      // 全角ドットやカンマ
      .replace(/．/g, ".")
      .replace(/，/g, ",")
      // 空白の除去
      .replace(/\s+/g, "")
      // アルファベットの大文字小文字を統一（一応小文字に）
      .toLowerCase()
      .trim();
  }

  // 3. 問題データベース (各単元最低2問ずつの計48問)
  const database = {
    "expressions": {
      "factorization": {
        "basic": [
          {
            questionHtml: "<p>$(x + 3)(x + 4)$ を展開したとき、 $x^2 + ax + 12$ となります。</p><p>定数 $a$ の値を求めなさい。</p>",
            instruction: "解答を半角の整数で入力してください。",
            answerForm: {
              type: "number",
              fields: [
                { id: "ans_a", label: "定数 a", allowedKeys: ["0-9", "-"], placeholder: "例: 5" }
              ]
            },
            answers: { "ans_a": "7" },
            correctAnswerTextHtml: "$a = 7$",
            solutionHtml: "<p>展開公式 $(x + a)(x + b) = x^2 + (a+b)x + ab$ を用います。</p><p>$(x + 3)(x + 4) = x^2 + (3+4)x + 3 \\times 4 = x^2 + 7x + 12$</p><p>したがって、定数 $a$ の値は <strong>$7$</strong> です。</p>"
          },
          {
            questionHtml: "<p>$x^2 - 5x + 6$ を因数分解すると $(x - a)(x - b)$ （ただし $a &lt; b$）となります。</p><p>定数 $a, b$ の値をそれぞれ求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="inline-input-row">
                  <span>a = </span>
                  <input type="text" id="ans_a" class="math-input very-short-input" aria-label="定数 a">
                  <span style="margin: 0 15px;">,</span>
                  <span>b = </span>
                  <input type="text" id="ans_b" class="math-input very-short-input" aria-label="定数 b">
                </div>
              `,
              fields: [
                { id: "ans_a", label: "定数 a", allowedKeys: ["0-9", "-"] },
                { id: "ans_b", label: "定数 b", allowedKeys: ["0-9", "-"] }
              ]
            },
            answers: { "ans_a": "2", "ans_b": "3" },
            correctAnswerTextHtml: "$a = 2, \\ b = 3$",
            solutionHtml: "<p>和が $-5$、積が $6$ となる2つの整数を探します。</p><p>その2数は $-2$ と $-3$ なので、因数分解すると次のようになります。</p><p>$x^2 - 5x + 6 = (x - 2)(x - 3)$</p><p>問題の条件 $a &lt; b$ より、 $a = 2, \\ b = 3$ となります。</p>"
          }
        ],
        "standard": [
          {
            questionHtml: "<p>$(2x - 3y)^2$ を展開したとき、 $ax^2 - bxy + cy^2$ となります。</p><p>定数 $a, b, c$ の値をそれぞれ求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="inline-input-row">
                  <span>a = </span><input type="text" id="ans_a" class="math-input very-short-input" aria-label="定数 a">
                  <span style="margin: 0 8px;">,</span>
                  <span>b = </span><input type="text" id="ans_b" class="math-input very-short-input" aria-label="定数 b">
                  <span style="margin: 0 8px;">,</span>
                  <span>c = </span><input type="text" id="ans_c" class="math-input very-short-input" aria-label="定数 c">
                </div>
              `,
              fields: [
                { id: "ans_a", label: "定数 a", allowedKeys: ["0-9"] },
                { id: "ans_b", label: "定数 b", allowedKeys: ["0-9"] },
                { id: "ans_c", label: "定数 c", allowedKeys: ["0-9"] }
              ]
            },
            answers: { "ans_a": "4", "ans_b": "12", "ans_c": "9" },
            correctAnswerTextHtml: "$a = 4, \\ b = 12, \\ c = 9$",
            solutionHtml: "<p>展開公式 $(A - B)^2 = A^2 - 2AB + B^2$ を用います。</p><p>$(2x - 3y)^2 = (2x)^2 - 2(2x)(3y) + (3y)^2 = 4x^2 - 12xy + 9y^2$</p><p>展開結果の符号が $-bxy$ となっていることに注意すると、 $a = 4, \\ b = 12, \\ c = 9$ です。</p>"
          },
          {
            questionHtml: "<p>$2x^2 + 5x - 3$ を因数分解すると $(ax - 1)(bx + c)$ （ただし $a &gt; 0, b &gt; 0$）となります。</p><p>定数 $a, b, c$ の値を求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="inline-input-row">
                  <span>a = </span><input type="text" id="ans_a" class="math-input very-short-input" aria-label="定数 a">
                  <span style="margin: 0 8px;">,</span>
                  <span>b = </span><input type="text" id="ans_b" class="math-input very-short-input" aria-label="定数 b">
                  <span style="margin: 0 8px;">,</span>
                  <span>c = </span><input type="text" id="ans_c" class="math-input very-short-input" aria-label="定数 c">
                </div>
              `,
              fields: [
                { id: "ans_a", label: "定数 a", allowedKeys: ["0-9"] },
                { id: "ans_b", label: "定数 b", allowedKeys: ["0-9"] },
                { id: "ans_c", label: "定数 c", allowedKeys: ["0-9"] }
              ]
            },
            answers: { "ans_a": "2", "ans_b": "1", "ans_c": "3" },
            correctAnswerTextHtml: "$a = 2, \\ b = 1, \\ c = 3$",
            solutionHtml: "<p>たすき掛けの法を用います。</p><p>$2$ 次の係数が $2$、定数項が $-3$、 $1$ 次の係数が $+5$ となる組み合わせを探します。</p><p>$(2x - 1)(x + 3) = 2x^2 + 6x - x - 3 = 2x^2 + 5x - 3$</p><p>問題の条件 $a &gt; 0, b &gt; 0$ より、 $a = 2, \\ b = 1, \\ c = 3$ となります。</p>"
          }
        ],
        "advanced": [
          {
            questionHtml: "<p>$x^2 + xy - 2y^2 + 4x + 5y + 3$ を因数分解すると $(x - y + a)(x + 2y + b)$ となります。</p><p>定数 $a, b$ の値をそれぞれ求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="inline-input-row">
                  <span>a = </span><input type="text" id="ans_a" class="math-input very-short-input" aria-label="定数 a">
                  <span style="margin: 0 15px;">,</span>
                  <span>b = </span><input type="text" id="ans_b" class="math-input very-short-input" aria-label="定数 b">
                </div>
              `,
              fields: [
                { id: "ans_a", label: "定数 a", allowedKeys: ["0-9", "-"] },
                { id: "ans_b", label: "定数 b", allowedKeys: ["0-9", "-"] }
              ]
            },
            answers: { "ans_a": "3", "ans_b": "1" },
            correctAnswerTextHtml: "$a = 3, \\ b = 1$",
            solutionHtml: "<p>この式を $x$ について整理します。</p><p>$x^2 + (y + 4)x - (2y^2 - 5y - 3)$</p><p>ここで定数部分（ $y$ の式）を因数分解します。</p><p>$2y^2 - 5y - 3 = (2y + 1)(y - 3)$</p><p>これを利用して全体でたすき掛けを行います。</p><p>$x^2 + (y + 4)x - (2y + 1)(y - 3) = \\{x + (2y + 1)\\}\\{x - (y - 3)\\} = (x + 2y + 1)(x - y + 3)$</p><p>したがって、求める定数は $a = 3, \\ b = 1$ となります。</p>"
          },
          {
            questionHtml: "<p>$x = \\frac{1}{\\sqrt{2} - 1}$ のとき、 $x^2 - 2x$ の値を求めなさい。</p>",
            instruction: "解答を半角の整数で入力してください。",
            answerForm: {
              type: "number",
              fields: [
                { id: "ans", label: "式の値", allowedKeys: ["0-9", "-"], placeholder: "例: 2" }
              ]
            },
            answers: { "ans": "1" },
            correctAnswerTextHtml: "$1$",
            solutionHtml: "<p>まず、 $x$ の分母を有理化します。</p><p>$x = \\frac{1(\\sqrt{2} + 1)}{(\\sqrt{2} - 1)(\\sqrt{2} + 1)} = \\frac{\\sqrt{2} + 1}{2 - 1} = \\sqrt{2} + 1$</p><p>次に、 $x - 1 = \\sqrt{2}$ と変形し、両辺を $2$ 乗します。</p><p>$(x - 1)^2 = (\\sqrt{2})^2$</p><p>$x^2 - 2x + 1 = 2$</p><p>両辺から $1$ を引くことで、 $x^2 - 2x = 1$ が得られます。</p><p>したがって、求める値は <strong>$1$</strong> です。</p>"
          }
        ]
      },
      "inequalities": {
        "basic": [
          {
            questionHtml: "<p>一次不等式 $3x - 5 &lt; 7$ を解きなさい。</p><p>解が $x &lt; a$ と表されるとき、定数 $a$ の値を求めなさい。</p>",
            instruction: "解答を半角の整数で入力してください。",
            answerForm: {
              type: "number",
              fields: [
                { id: "ans_a", label: "定数 a", allowedKeys: ["0-9", "-"], placeholder: "例: 3" }
              ]
            },
            answers: { "ans_a": "4" },
            correctAnswerTextHtml: "$x &lt; 4$",
            solutionHtml: "<p>不等式を解きます。</p><p>$3x - 5 &lt; 7$</p><p>左辺の $-5$ を右辺に移項します。</p><p>$3x &lt; 12$</p><p>両辺を $3$ で割ります（ $3 &gt; 0$ なので不等号の向きは変わりません）。</p><p>$x &lt; 4$</p><p>したがって、定数 $a$ の値は <strong>$4$</strong> です。</p>"
          },
          {
            questionHtml: "<p>一次不等式 $-2x + 3 \\le 9$ を解きなさい。</p><p>解が $x \\ge a$ と表されるとき、定数 $a$ の値を求めなさい。</p>",
            instruction: "解答を半角の整数で入力してください。",
            answerForm: {
              type: "number",
              fields: [
                { id: "ans_a", label: "定数 a", allowedKeys: ["0-9", "-"], placeholder: "例: -2" }
              ]
            },
            answers: { "ans_a": "-3" },
            correctAnswerTextHtml: "$x \\ge -3$",
            solutionHtml: "<p>不等式を解きます。</p><p>$-2x + 3 \\le 9$</p><p>左辺の $3$ を右辺に移項します。</p><p>$-2x \\le 6$</p><p>両辺を $-2$ で割ります。<strong>負の数で割るため、不等号の向きが逆になります。</strong></p><p>$x \\ge -3$</p><p>したがって、定数 $a$ の値は <strong>$-3$</strong> です。</p>"
          }
        ],
        "standard": [
          {
            questionHtml: "<p>連立不等式 $\\begin{cases} 2x - 3 &lt; 5 \\\\ -3x + 1 &lt; -8 \\end{cases}$ を解きなさい。</p><p>解が $a &lt; x &lt; b$ と表されるとき、定数 $a, b$ の値をそれぞれ求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="inline-input-row">
                  <span>a = </span><input type="text" id="ans_a" class="math-input very-short-input" aria-label="定数 a">
                  <span style="margin: 0 15px;">,</span>
                  <span>b = </span><input type="text" id="ans_b" class="math-input very-short-input" aria-label="定数 b">
                </div>
              `,
              fields: [
                { id: "ans_a", label: "定数 a", allowedKeys: ["0-9", "-"] },
                { id: "ans_b", label: "定数 b", allowedKeys: ["0-9", "-"] }
              ]
            },
            answers: { "ans_a": "3", "ans_b": "4" },
            correctAnswerTextHtml: "$3 &lt; x &lt; 4$",
            solutionHtml: "<p>それぞれの不等式を解きます。</p><p>① $2x - 3 &lt; 5 \\implies 2x &lt; 8 \\implies x &lt; 4$</p><p>② $-3x + 1 &lt; -8 \\implies -3x &lt; -9 \\implies x &gt; 3$ (不等号の向きが逆になります)</p><p>①と②の共通範囲を求めると、次のようになります。</p><p>$3 &lt; x &lt; 4$</p><p>したがって、定数 $a = 3, \\ b = 4$ です。</p>"
          },
          {
            questionHtml: "<p>絶対値を含む方程式 $|x - 2| = 5$ を解きなさい。</p><p>解が $x = a, \\ b$ （ただし $a &lt; b$）のとき、定数 $a, b$ の値をそれぞれ求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="inline-input-row">
                  <span>a = </span><input type="text" id="ans_a" class="math-input very-short-input" aria-label="定数 a">
                  <span style="margin: 0 15px;">,</span>
                  <span>b = </span><input type="text" id="ans_b" class="math-input very-short-input" aria-label="定数 b">
                </div>
              `,
              fields: [
                { id: "ans_a", label: "定数 a", allowedKeys: ["0-9", "-"] },
                { id: "ans_b", label: "定数 b", allowedKeys: ["0-9", "-"] }
              ]
            },
            answers: { "ans_a": "-7", "ans_b": "7" }, // おっと、|x - 2| = 5 だから x - 2 = 5 or -5 => x = 7 or -3。訂正する
            answers: { "ans_a": "-3", "ans_b": "7" },
            correctAnswerTextHtml: "$x = -3, \\ 7$",
            solutionHtml: "<p>絶対値の定義より、 $|X| = c \\ (c &gt; 0) \\implies X = \\pm c$ となります。</p><p>$x - 2 = \\pm 5$</p><p>したがって、次の2つの場合に分けられます。</p><p>1) $x - 2 = 5 \\implies x = 7$</p><p>2) $x - 2 = -5 \\implies x = -3$</p><p>条件 $a &lt; b$ より、 $a = -3, \\ b = 7$ となります。</p>"
          }
        ],
        "advanced": [
          {
            questionHtml: "<p>絶対値を含む不等式 $|2x - 3| &lt; 5$ を解きなさい。</p><p>解が $a &lt; x &lt; b$ と表されるとき、定数 $a, b$ の値をそれぞれ求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="inline-input-row">
                  <span>a = </span><input type="text" id="ans_a" class="math-input very-short-input" aria-label="定数 a">
                  <span style="margin: 0 15px;">,</span>
                  <span>b = </span><input type="text" id="ans_b" class="math-input very-short-input" aria-label="定数 b">
                </div>
              `,
              fields: [
                { id: "ans_a", label: "定数 a", allowedKeys: ["0-9", "-"] },
                { id: "ans_b", label: "定数 b", allowedKeys: ["0-9", "-"] }
              ]
            },
            answers: { "ans_a": "-1", "ans_b": "4" },
            correctAnswerTextHtml: "$-1 &lt; x &lt; 4$",
            solutionHtml: "<p>絶対値を含む不等式 $|X| &lt; c \\implies -c &lt; X &lt; c$ の形に変形します。</p><p>$-5 &lt; 2x - 3 &lt; 5$</p><p>各辺に $3$ を加えます。</p><p>$-2 &lt; 2x &lt; 8$</p><p>各辺を $2$ で割ります。</p><p>$-1 &lt; x &lt; 4$</p><p>したがって、求める定数は $a = -1, \\ b = 4$ です。</p>"
          },
          {
            questionHtml: "<p>不等式 $ax + 2 &gt; 0$ の解が $x &lt; 2$ であるとき、定数 $a$ の値を求めなさい。</p>",
            instruction: "解答を半角の整数で入力してください。",
            answerForm: {
              type: "number",
              fields: [
                { id: "ans_a", label: "定数 a", allowedKeys: ["0-9", "-"], placeholder: "例: -1" }
              ]
            },
            answers: { "ans_a": "-1" },
            correctAnswerTextHtml: "$a = -1$",
            solutionHtml: "<p>まず、不等式 $ax + 2 &gt; 0$ を変形します。</p><p>$ax &gt; -2$</p><p>この不等式の解が $x &lt; 2$（不等号の向きが逆）であることから、<strong>$a$ は負の数（ $a &lt; 0$ ）</strong>であることが分かります。</p><p>両辺を $a$ で割ると、解は次のようになります。</p><p>$x &lt; -\\frac{2}{a}$</p><p>これが $x &lt; 2$ と一致するため、次の等式が成り立ちます。</p><p>$-\\frac{2}{a} = 2 \\implies 2a = -2 \\implies a = -1$</p><p>これは $a &lt; 0$ を満たしています。よって、 $a = -1$ です。</p>"
          }
        ]
      }
    },
    "quadratic": {
      "graphs": {
        "basic": [
          {
            questionHtml: "<p>$2$次関数 $y = x^2 - 4x + 3$ の頂点の座標を求めなさい。</p>",
            instruction: "頂点の座標 $(p, q)$ の各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="inline-input-row">
                  <span>頂点 ( </span>
                  <input type="text" id="ans_p" class="math-input very-short-input" aria-label="頂点のx座標">
                  <span style="margin: 0 5px;">,</span>
                  <input type="text" id="ans_q" class="math-input very-short-input" aria-label="頂点のy座標">
                  <span> )</span>
                </div>
              `,
              fields: [
                { id: "ans_p", label: "頂点のx座標", allowedKeys: ["0-9", "-"] },
                { id: "ans_q", label: "頂点のy座標", allowedKeys: ["0-9", "-"] }
              ]
            },
            answers: { "ans_p": "2", "ans_q": "-1" },
            correctAnswerTextHtml: "頂点 $(2, -1)$",
            solutionHtml: "<p>与えられた式を平方完成して、頂点の座標を求めます。</p><p>$y = x^2 - 4x + 3$</p><p>$y = (x - 2)^2 - 2^2 + 3$</p><p>$y = (x - 2)^2 - 4 + 3$</p><p>$y = (x - 2)^2 - 1$</p><p>したがって、頂点の座標は <strong>$(2, -1)$</strong> となります。</p>"
          },
          {
            questionHtml: "<p>$2$次関数 $y = -x^2 - 2x + 5$ の頂点の座標を求めなさい。</p>",
            instruction: "頂点の座標 $(p, q)$ の各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="inline-input-row">
                  <span>頂点 ( </span>
                  <input type="text" id="ans_p" class="math-input very-short-input" aria-label="頂点のx座標">
                  <span style="margin: 0 5px;">,</span>
                  <input type="text" id="ans_q" class="math-input very-short-input" aria-label="頂点のy座標">
                  <span> )</span>
                </div>
              `,
              fields: [
                { id: "ans_p", label: "頂点のx座標", allowedKeys: ["0-9", "-"] },
                { id: "ans_q", label: "頂点のy座標", allowedKeys: ["0-9", "-"] }
              ]
            },
            answers: { "ans_p": "-1", "ans_q": "6" },
            correctAnswerTextHtml: "頂点 $(-1, 6)$",
            solutionHtml: "<p>二次項の係数 $-1$ でくくって平方完成します。</p><p>$y = -(x^2 + 2x) + 5$</p><p>$y = -\\{(x + 1)^2 - 1^2\\} + 5$</p><p>$y = -(x + 1)^2 + 1 + 5$</p><p>$y = -(x + 1)^2 + 6$</p><p>したがって、頂点の座標は <strong>$(-1, 6)$</strong> です。</p>"
          }
        ],
        "standard": [
          {
            questionHtml: "<p>$2$次関数 $y = 2x^2 - 8x + 5$ のグラフを、 $x$ 軸方向に $1$、 $y$ 軸方向に $-3$ だけ平行移動したグラフの式を表すとき、 $y = 2x^2 + ax + b$ となります。</p><p>定数 $a, b$ の値をそれぞれ求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="inline-input-row">
                  <span>a = </span><input type="text" id="ans_a" class="math-input short-input" aria-label="定数 a">
                  <span style="margin: 0 15px;">,</span>
                  <span>b = </span><input type="text" id="ans_b" class="math-input short-input" aria-label="定数 b">
                </div>
              `,
              fields: [
                { id: "ans_a", label: "定数 a", allowedKeys: ["0-9", "-"] },
                { id: "ans_b", label: "定数 b", allowedKeys: ["0-9", "-"] }
              ]
            },
            answers: { "ans_a": "-12", "ans_b": "12" },
            correctAnswerTextHtml: "$y = 2x^2 - 12x + 12$",
            solutionHtml: "<p>まず、元のグラフの頂点を求めるために平方完成します。</p><p>$y = 2(x^2 - 4x) + 5 = 2\\{(x - 2)^2 - 4\\} + 5 = 2(x - 2)^2 - 3$</p><p>元の頂点の座標は $(2, -3)$ です。</p><p>この頂点を $x$ 軸方向に $1$、 $y$ 軸方向に $-3$ 平行移動させると、新しい頂点の座標は次のようになります。</p><p>頂点： $(2+1, \\ -3-3) = (3, -6)$</p><p>頂点が $(3, -6)$ で $2$ 次の係数が $2$ であるグラフの式は以下の通りです。</p><p>$y = 2(x - 3)^2 - 6 = 2(x^2 - 6x + 9) - 6 = 2x^2 - 12x + 12$</p><p>よって、定数は $a = -12, \\ b = 12$ です。</p>"
          },
          {
            questionHtml: "<p>$2$次関数 $y = x^2 - 2x - 3$ の、定義域 $-1 \\le x \\le 3$ における最大値 $M$ と最小値 $m$ をそれぞれ求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="inline-input-row">
                  <span>最大値 M = </span><input type="text" id="ans_M" class="math-input very-short-input" aria-label="最大値 M">
                  <span style="margin: 0 15px;">,</span>
                  <span>最小値 m = </span><input type="text" id="ans_m" class="math-input very-short-input" aria-label="最小値 m">
                </div>
              `,
              fields: [
                { id: "ans_M", label: "最大値 M", allowedKeys: ["0-9", "-"] },
                { id: "ans_m", label: "最小値 m", allowedKeys: ["0-9", "-"] }
              ]
            },
            answers: { "ans_M": "0", "ans_m": "-4" },
            correctAnswerTextHtml: "最大値 $M = 0, \\ $ 最小値 $m = -4$",
            solutionHtml: "<p>与えられた式を平方完成して軸の位置を確認します。</p><p>$y = (x - 1)^2 - 4$</p><p>グラフは下に凸で、軸は $x = 1$ です。</p><p>定義域 $-1 \\le x \\le 3$ は軸 $x = 1$ を含んでいます。</p><p>・最小値 $m$ は頂点（ $x = 1$ のとき）でとります。</p><p>$m = -4$</p><p>・最大値 $M$ は軸から最も遠い両端（ $x = -1$ および $x = 3$ のとき）でとります。</p><p>$x = -1 \\implies y = (-1)^2 - 2(-1) - 3 = 0$</p><p>$x = 3 \\implies y = 3^2 - 2(3) - 3 = 0$</p><p>よって、最大値 $M = 0$ です。</p>"
          }
        ],
        "advanced": [
          {
            questionHtml: "<p>$3$点 $(1, 2), \\ (2, 5), \\ (0, 1)$ を通るような $2$次関数 $y = ax^2 + bx + c$ を求めるとき、定数 $a, b, c$ の値をそれぞれ求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="inline-input-row">
                  <span>a = </span><input type="text" id="ans_a" class="math-input very-short-input" aria-label="定数 a">
                  <span style="margin: 0 8px;">,</span>
                  <span>b = </span><input type="text" id="ans_b" class="math-input very-short-input" aria-label="定数 b">
                  <span style="margin: 0 8px;">,</span>
                  <span>c = </span><input type="text" id="ans_c" class="math-input very-short-input" aria-label="定数 c">
                </div>
              `,
              fields: [
                { id: "ans_a", label: "定数 a", allowedKeys: ["0-9", "-"] },
                { id: "ans_b", label: "定数 b", allowedKeys: ["0-9", "-"] },
                { id: "ans_c", label: "定数 c", allowedKeys: ["0-9", "-"] }
              ]
            },
            answers: { "ans_a": "1", "ans_b": "0", "ans_c": "1" },
            correctAnswerTextHtml: "$y = x^2 + 1 \\ (a=1, \\ b=0, \\ c=1)$",
            solutionHtml: "<p>通る点 $(x, y)$ を $y = ax^2 + bx + c$ にそれぞれ代入して連立方程式を作ります。</p><p>1) 点 $(0, 1)$ を代入：</p><p>$1 = a(0)^2 + b(0) + c \\implies c = 1$</p><p>2) 点 $(1, 2)$ を代入：</p><p>$2 = a(1)^2 + b(1) + 1 \\implies a + b = 1$　…①</p><p>3) 点 $(2, 5)$ を代入：</p><p>$5 = a(2)^2 + b(2) + 1 \\implies 4a + 2b = 4 \\implies 2a + b = 2$　…②</p><p>①と②を解きます。</p><p>② $-$ ① より、 $a = 1$</p><p>①に代入して、 $1 + b = 1 \\implies b = 0$</p><p>したがって、 $a = 1, \\ b = 0, \\ c = 1$ となります。</p>"
          },
          {
            questionHtml: "<p>$2$次関数 $y = x^2 - 2ax + a^2 - 2a$ （ただし $a$ は定数）の $0 \\le x \\le 2$ における最小値が $-5$ であるとき、定数 $a$ の値を求めなさい。ただし、 $a &gt; 2$ とします。</p>",
            instruction: "解答を半角の整数で入力してください。",
            answerForm: {
              type: "number",
              fields: [
                { id: "ans_a", label: "定数 a", allowedKeys: ["0-9", "-"], placeholder: "例: 3" }
              ]
            },
            answers: { "ans_a": "3" },
            correctAnswerTextHtml: "$a = 3$",
            solutionHtml: "<p>まず、平方完成を行い軸を確認します。</p><p>$y = (x - a)^2 - a^2 + a^2 - 2a = (x - a)^2 - 2a$</p><p>グラフは下に凸で、軸は $x = a$ です。</p><p>問題の条件より $a &gt; 2$ であるため、軸は定義域 $0 \\le x \\le 2$ より右側にあります。</p><p>このとき、グラフは $0 \\le x \\le 2$ で右下がりの単調減少となるため、<strong>最小値は定義域の右端 $x = 2$ のとき</strong>にとります。</p><p>$x = 2$ を元の式に代入します。</p><p>$y(2) = 2^2 - 2a(2) + a^2 - 2a = a^2 - 6a + 4$</p><p>これが最小値 $-5$ と等しくなるので、方程式を解きます。</p><p>$a^2 - 6a + 4 = -5$</p><p>$a^2 - 6a + 9 = 0$</p><p>$(a - 3)^2 = 0 \\implies a = 3$</p><p>これは $a &gt; 2$ の条件を満たしています。よって、 $a = 3$ です。</p>"
          }
        ]
      },
      "equations": {
        "basic": [
          {
            questionHtml: "<p>$2$次方程式 $x^2 - 5x - 6 = 0$ を解きなさい。</p><p>解が $x = a, \\ b$ （ただし $a &lt; b$）のとき、定数 $a, b$ の値をそれぞれ求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="inline-input-row">
                  <span>a = </span><input type="text" id="ans_a" class="math-input very-short-input" aria-label="解 a">
                  <span style="margin: 0 15px;">,</span>
                  <span>b = </span><input type="text" id="ans_b" class="math-input very-short-input" aria-label="解 b">
                </div>
              `,
              fields: [
                { id: "ans_a", label: "解 a", allowedKeys: ["0-9", "-"] },
                { id: "ans_b", label: "解 b", allowedKeys: ["0-9", "-"] }
              ]
            },
            answers: { "ans_a": "-1", "ans_b": "6" },
            correctAnswerTextHtml: "$x = -1, \\ 6$",
            solutionHtml: "<p>左辺を因数分解します。</p><p>積が $-6$、和が $-5$ となる2数は $-6$ と $+1$ です。</p><p>$(x - 6)(x + 1) = 0$</p><p>これを解くと、 $x = -1, \\ 6$ となります。</p><p>条件 $a &lt; b$ より、 $a = -1, \\ b = 6$ となります。</p>"
          },
          {
            questionHtml: "<p>$2$次不等式 $x^2 - 4 &lt; 0$ を解きなさい。</p><p>解が $a &lt; x &lt; b$ と表されるとき、定数 $a, b$ の値をそれぞれ求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="inline-input-row">
                  <span>a = </span><input type="text" id="ans_a" class="math-input very-short-input" aria-label="定数 a">
                  <span style="margin: 0 15px;">,</span>
                  <span>b = </span><input type="text" id="ans_b" class="math-input very-short-input" aria-label="定数 b">
                </div>
              `,
              fields: [
                { id: "ans_a", label: "定数 a", allowedKeys: ["0-9", "-"] },
                { id: "ans_b", label: "定数 b", allowedKeys: ["0-9", "-"] }
              ]
            },
            answers: { "ans_a": "-2", "ans_b": "2" },
            correctAnswerTextHtml: "$-2 &lt; x &lt; 2$",
            solutionHtml: "<p>まず、対応する2次方程式 $x^2 - 4 = 0$ を解きます。</p><p>$(x - 2)(x + 2) = 0 \\implies x = \\pm 2$</p><p>不等号が $&lt;$（より小さい）であるため、解は2つの値の間（内側）になります。</p><p>$-2 &lt; x &lt; 2$</p><p>したがって、定数は $a = -2, \\ b = 2$ となります。</p>"
          }
        ],
        "standard": [
          {
            questionHtml: "<p>$2$次方程式 $2x^2 - 5x + 1 = 0$ を解きなさい。</p><p>解が $x = \\frac{a \\pm \\sqrt{b}}{c}$ と表されるとき、自然数 $a, b, c$ の値をそれぞれ求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="fraction-input-wrapper">
                  <div class="fraction-input-container">
                    <div class="fraction-numerator">
                      <input type="text" id="ans_a" class="math-input very-short-input" aria-label="分子の整数a">
                      <span class="math-operator">±</span>
                      <span>√</span>
                      <input type="text" id="ans_b" class="math-input very-short-input" aria-label="ルートの中身b">
                    </div>
                    <div class="fraction-line"></div>
                    <div class="fraction-denominator">
                      <input type="text" id="ans_c" class="math-input very-short-input" aria-label="分母の整数c">
                    </div>
                  </div>
                </div>
              `,
              fields: [
                { id: "ans_a", label: "分子の整数a", allowedKeys: ["0-9"] },
                { id: "ans_b", label: "ルートの中身b", allowedKeys: ["0-9"] },
                { id: "ans_c", label: "分母の整数c", allowedKeys: ["0-9"] }
              ]
            },
            answers: { "ans_a": "5", "ans_b": "17", "ans_c": "4" },
            correctAnswerTextHtml: "$x = \\frac{5 \\pm \\sqrt{17}}{4}$",
            solutionHtml: "<p>左辺は因数分解が難しいため、解の公式 $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ を用います。</p><p>$a = 2, \\ b = -5, \\ c = 1$ を代入します。</p><p>$x = \\frac{-(-5) \\pm \\sqrt{(-5)^2 - 4 \\times 2 \\times 1}}{2 \\times 2}$</p><p>$x = \\frac{5 \\pm \\sqrt{25 - 8}}{4} = \\frac{5 \\pm \\sqrt{17}}{4}$</p><p>したがって、 $a = 5, \\ b = 17, \\ c = 4$ となります。</p>"
          },
          {
            questionHtml: "<p>$2$次不等式 $x^2 - 2x - 8 \\ge 0$ を解きなさい。</p><p>解が $x \\le a, \\ b \\le x$ （ただし $a &lt; b$）と表されるとき、定数 $a, b$ の値をそれぞれ求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="inline-input-row">
                  <span>a = </span><input type="text" id="ans_a" class="math-input very-short-input" aria-label="定数 a">
                  <span style="margin: 0 15px;">,</span>
                  <span>b = </span><input type="text" id="ans_b" class="math-input very-short-input" aria-label="定数 b">
                </div>
              `,
              fields: [
                { id: "ans_a", label: "定数 a", allowedKeys: ["0-9", "-"] },
                { id: "ans_b", label: "定数 b", allowedKeys: ["0-9", "-"] }
              ]
            },
            answers: { "ans_a": "-2", "ans_b": "4" },
            correctAnswerTextHtml: "$x \\le -2, \\ 4 \\le x$",
            solutionHtml: "<p>まず、左辺を因数分解して対応する方程式の解を求めます。</p><p>$(x - 4)(x + 2) \\ge 0$</p><p>境界値は $x = -2, \\ 4$ です。</p><p>不等号が $\\ge$（以上）であるため、解は境界値の外側になります。</p><p>$x \\le -2, \\ 4 \\le x$</p><p>条件 $a &lt; b$ より、 $a = -2, \\ b = 4$ となります。</p>"
          }
        ],
        "advanced": [
          {
            questionHtml: "<p>$2$次方程式 $x^2 - 2(k - 1)x + k^2 - 5 = 0$ が実数解をもつとき、定数 $k$ の値の範囲を求めなさい。</p><p>範囲が $k \\le a$ と表されるとき、定数 $a$ の値を求めなさい。</p>",
            instruction: "解答を半角の整数で入力してください。",
            answerForm: {
              type: "number",
              fields: [
                { id: "ans_a", label: "定数 a", allowedKeys: ["0-9", "-"], placeholder: "例: 3" }
              ]
            },
            answers: { "ans_a": "3" },
            correctAnswerTextHtml: "$k \\le 3$",
            solutionHtml: "<p>二次方程式が実数解をもつための条件は、判別式 $D \\ge 0$ です。</p><p>ここでは $x$ の係数が $2$ の倍数であるため、 $D/4 \\ge 0$ を利用します。</p><p>$D/4 = \\{-(k - 1)\\}^2 - 1 \\times (k^2 - 5)$</p><p>$D/4 = (k^2 - 2k + 1) - k^2 + 5$</p><p>$D/4 = -2k + 6$</p><p>これが $0$ 以上となるので、</p><p>$-2k + 6 \\ge 0$</p><p>$-2k \\ge -6 \\implies k \\le 3$ （不等号が逆になります）</p><p>したがって、定数 $a$ の値は <strong>$3$</strong> となります。</p>"
          },
          {
            questionHtml: "<p>$2$次不等式 $x^2 - ax + b &lt; 0$ の解が $2 &lt; x &lt; 5$ であるとき、定数 $a, b$ の値をそれぞれ求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="inline-input-row">
                  <span>a = </span><input type="text" id="ans_a" class="math-input very-short-input" aria-label="定数 a">
                  <span style="margin: 0 15px;">,</span>
                  <span>b = </span><input type="text" id="ans_b" class="math-input very-short-input" aria-label="定数 b">
                </div>
              `,
              fields: [
                { id: "ans_a", label: "定数 a", allowedKeys: ["0-9", "-"] },
                { id: "ans_b", label: "定数 b", allowedKeys: ["0-9", "-"] }
              ]
            },
            answers: { "ans_a": "7", "ans_b": "10" },
            correctAnswerTextHtml: "$a = 7, \\ b = 10$",
            solutionHtml: "<p>解が $2 &lt; x &lt; 5$ となる $2$次不等式の一つは次の通りです。</p><p>$(x - 2)(x - 5) &lt; 0$</p><p>この左辺を展開します。</p><p>$x^2 - 7x + 10 &lt; 0$</p><p>これと元の式 $x^2 - ax + b &lt; 0$ の係数を比較します。</p><p>$-a = -7 \\implies a = 7$</p><p>$b = 10$</p><p>したがって、 $a = 7, \\ b = 10$ となります。</p>"
          }
        ]
      }
    },
    "trigonometry": {
      "ratios": {
        "basic": [
          {
            questionHtml: "<p>直角三角形において、斜辺の長さが $5$、隣辺（底辺）の長さが $4$、対辺（高さ）の長さが $3$ であるとき、角 $\\theta$ に対応する $\\cos \\theta$ の値を分数で求めなさい。</p>",
            instruction: "分数の各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="fraction-input-wrapper">
                  <div class="fraction-input-container">
                    <div class="fraction-numerator">
                      <input type="text" id="ans_num" class="math-input very-short-input" aria-label="分子">
                    </div>
                    <div class="fraction-line"></div>
                    <div class="fraction-denominator">
                      <input type="text" id="ans_den" class="math-input very-short-input" aria-label="分母">
                    </div>
                  </div>
                </div>
              `,
              fields: [
                { id: "ans_num", label: "分子", allowedKeys: ["0-9", "-"] },
                { id: "ans_den", label: "分母", allowedKeys: ["0-9"] }
              ]
            },
            answers: { "ans_num": "4", "ans_den": "5" },
            correctAnswerTextHtml: "$\\cos \\theta = \\frac{4}{5}$",
            solutionHtml: "<p>三角比の定義より、 $\\cos \\theta = \\frac{\\text{隣辺（底辺）}}{\\text{斜辺}}$ となります。</p><p>斜辺の長さが $5$、隣辺が $4$ なので、</p><p>$\\cos \\theta = \\frac{4}{5}$</p><p>よって、分子は $4$、分母は $5$ となります。</p>"
          },
          {
            questionHtml: "<p>$\\sin 120^\\circ$ の値を求めなさい。</p><p>答えが $\\frac{\\sqrt{a}}{b}$ と表されるとき、自然数 $a, b$ の値をそれぞれ求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="fraction-input-wrapper">
                  <div class="fraction-input-container">
                    <div class="fraction-numerator">
                      <span>√</span>
                      <input type="text" id="ans_a" class="math-input very-short-input" aria-label="ルートの中身a">
                    </div>
                    <div class="fraction-line"></div>
                    <div class="fraction-denominator">
                      <input type="text" id="ans_b" class="math-input very-short-input" aria-label="分母b">
                    </div>
                  </div>
                </div>
              `,
              fields: [
                { id: "ans_a", label: "ルートの中身a", allowedKeys: ["0-9"] },
                { id: "ans_b", label: "分母b", allowedKeys: ["0-9"] }
              ]
            },
            answers: { "ans_a": "3", "ans_b": "2" },
            correctAnswerTextHtml: "$\\sin 120^\\circ = \\frac{\\sqrt{3}}{2}$",
            solutionHtml: "<p>単位円を描いて考えます。</p><p>$120^\\circ$ の動径が単位円と交わる点の $y$ 座標が $\\sin 120^\\circ$ になります。</p><p>この点は $y$ 軸に関して $60^\\circ$ の位置にある点と対称なので、次のようになります。</p><p>$\\sin 120^\\circ = \\sin 60^\\circ = \\frac{\\sqrt{3}}{2}$</p><p>したがって、 $a = 3, \\ b = 2$ となります。</p>"
          }
        ],
        "standard": [
          {
            questionHtml: "<p>$\\theta$ は鋭角（ $0^\\circ &lt; \\theta &lt; 90^\\circ$ ）とします。 $\\sin \\theta = \\frac{3}{5}$ のとき、 $\\cos \\theta$ の値と $\\tan \\theta$ の値をそれぞれ分数で求めなさい。</p>",
            instruction: "分数の各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="stacked-input-col">
                  <div>
                    <span>cos θ = </span>
                    <div class="fraction-input-wrapper" style="display:inline-block; vertical-align:middle;">
                      <div class="fraction-input-container">
                        <input type="text" id="cos_num" class="math-input very-short-input mini-fraction" aria-label="cos分子">
                        <div class="fraction-line"></div>
                        <input type="text" id="cos_den" class="math-input very-short-input mini-fraction" aria-label="cos分母">
                      </div>
                    </div>
                  </div>
                  <div>
                    <span>tan θ = </span>
                    <div class="fraction-input-wrapper" style="display:inline-block; vertical-align:middle;">
                      <div class="fraction-input-container">
                        <input type="text" id="tan_num" class="math-input very-short-input mini-fraction" aria-label="tan分子">
                        <div class="fraction-line"></div>
                        <input type="text" id="tan_den" class="math-input very-short-input mini-fraction" aria-label="tan分母">
                      </div>
                    </div>
                  </div>
                </div>
              `,
              fields: [
                { id: "cos_num", label: "cos分子", allowedKeys: ["0-9"] },
                { id: "cos_den", label: "cos分母", allowedKeys: ["0-9"] },
                { id: "tan_num", label: "tan分子", allowedKeys: ["0-9"] },
                { id: "tan_den", label: "tan分母", allowedKeys: ["0-9"] }
              ]
            },
            answers: { "cos_num": "4", "cos_den": "5", "tan_num": "3", "tan_den": "4" },
            correctAnswerTextHtml: "$\\cos \\theta = \\frac{4}{5}, \\ \\tan \\theta = \\frac{3}{4}$",
            solutionHtml: "<p>三角比の相互関係式 $\\sin^2 \\theta + \\cos^2 \\theta = 1$ を用います。</p><p>$\\cos^2 \\theta = 1 - \\sin^2 \\theta = 1 - \\left(\\frac{3}{5}\\right)^2 = 1 - \\frac{9}{25} = \\frac{16}{25}$</p><p>$\\theta$ は鋭角なので、 $\\cos \\theta &gt; 0$ です。</p><p>$\\cos \\theta = \\sqrt{\\frac{16}{25}} = \\frac{4}{5}$</p><p>また、 $\\tan \\theta$ は以下のように求まります。</p><p>$\\tan \\theta = \\frac{\\sin \\theta}{\\cos \\theta} = \\frac{3/5}{4/5} = \\frac{3}{4}$</p><p>したがって、答えは $\\cos \\theta = \\frac{4}{5}$、 $\\tan \\theta = \\frac{3}{4}$ となります。</p>"
          },
          {
            questionHtml: "<p>不等式 $2\\sin \\theta - 1 &gt; 0$ （ $0^\\circ \\le \\theta \\le 180^\\circ$ ）を解きなさい。</p><p>解が $a^circ &lt; \\theta &lt; b^circ$ と表されるとき、自然数 $a, b$ の値を求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="inline-input-row">
                  <span>a = </span><input type="text" id="ans_a" class="math-input very-short-input" aria-label="角a">
                  <span>° , </span>
                  <span>b = </span><input type="text" id="ans_b" class="math-input very-short-input" aria-label="角b">
                  <span>°</span>
                </div>
              `,
              fields: [
                { id: "ans_a", label: "角a", allowedKeys: ["0-9"] },
                { id: "ans_b", label: "角b", allowedKeys: ["0-9"] }
              ]
            },
            answers: { "ans_a": "30", "ans_b": "150" },
            correctAnswerTextHtml: "$30^\\circ &lt; \\theta &lt; 150^\\circ$",
            solutionHtml: "<p>与えられた不等式を変形します。</p><p>$2\\sin \\theta &gt; 1 \\implies \\sin \\theta &gt; \\frac{1}{2}$</p><p>単位円において、 $y$ 座標が $\\frac{1}{2}$ より大きくなる範囲を求めます。</p><p>$\\sin \\theta = \\frac{1}{2}$ となる角度は、 $0^\\circ \\le \\theta \\le 180^\\circ$ の範囲において $30^\\circ$ と $150^\\circ$ です。</p><p>したがって、それを超える範囲は <strong>$30^\\circ &lt; \\theta &lt; 150^\\circ$</strong> となります。</p>"
          }
        ],
        "advanced": [
          {
            questionHtml: "<p>$0^\\circ \\le \\theta \\le 180^\\circ$ において、方程式 $2\\cos^2 \\theta + 3\\sin \\theta - 3 = 0$ を解きなさい。</p><p>解が $\\theta = a^circ, \\ b^circ, \\ c^circ$ （ただし $a &lt; b &lt; c$）となるとき、自然数 $a, b, c$ の値をそれぞれ求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="inline-input-row">
                  <span>a = </span><input type="text" id="ans_a" class="math-input very-short-input" aria-label="角a">
                  <span>° , </span>
                  <span>b = </span><input type="text" id="ans_b" class="math-input very-short-input" aria-label="角b">
                  <span>° , </span>
                  <span>c = </span><input type="text" id="ans_c" class="math-input very-short-input" aria-label="角c">
                  <span>°</span>
                </div>
              `,
              fields: [
                { id: "ans_a", label: "角a", allowedKeys: ["0-9"] },
                { id: "ans_b", label: "角b", allowedKeys: ["0-9"] },
                { id: "ans_c", label: "角c", allowedKeys: ["0-9"] }
              ]
            },
            answers: { "ans_a": "30", "ans_b": "90", "ans_c": "150" },
            correctAnswerTextHtml: "$\\theta = 30^\\circ, \\ 90^\\circ, \\ 150^\\circ$",
            solutionHtml: "<p>相互関係式 $\\cos^2 \\theta = 1 - \\sin^2 \\theta$ を用いて、 $\\sin \\theta$ だけの式に統一します。</p><p>$2(1 - \\sin^2 \\theta) + 3\\sin \\theta - 3 = 0$</p><p>$2 - 2\\sin^2 \\theta + 3\\sin \\theta - 3 = 0$</p><p>$-2\\sin^2 \\theta + 3\\sin \\theta - 1 = 0 \\implies 2\\sin^2 \\theta - 3\\sin \\theta + 1 = 0$</p><p>これを因数分解します。</p><p>$(2\\sin \\theta - 1)(\\sin \\theta - 1) = 0 \\implies \\sin \\theta = \\frac{1}{2}, \\ 1$</p><p>$0^\\circ \\le \\theta \\le 180^\\circ$ の範囲で解くと、</p><p>・ $\\sin \\theta = \\frac{1}{2} \\implies \\theta = 30^\\circ, \\ 150^\\circ$</p><p>・ $\\sin \\theta = 1 \\implies \\theta = 90^\\circ$</p><p>したがって、小さい順に並べると $\\theta = 30^\\circ, \\ 90^\\circ, \\ 150^\\circ$ となります。</p>"
          },
          {
            questionHtml: "<p>三角形 $ABC$ において、 $AB = 5, \\ AC = 8, \\ \\angle A = 60^\\circ$ であるとき、この三角形の面積 $S$ を求めなさい。</p><p>答えが $a\\sqrt{b}$ の形で表されるとき、自然数 $a, b$ の値をそれぞれ求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="inline-input-row">
                  <span>S = </span>
                  <input type="text" id="ans_a" class="math-input very-short-input" aria-label="係数a">
                  <span>√</span>
                  <input type="text" id="ans_b" class="math-input very-short-input" aria-label="ルートの中身b">
                </div>
              `,
              fields: [
                { id: "ans_a", label: "係数a", allowedKeys: ["0-9"] },
                { id: "ans_b", label: "ルートの中身b", allowedKeys: ["0-9"] }
              ]
            },
            answers: { "ans_a": "10", "ans_b": "3" },
            correctAnswerTextHtml: "$S = 10\\sqrt{3}$",
            solutionHtml: "<p>三角形の面積公式 $S = \\frac{1}{2}bc \\sin A$ を用います。</p><p>$S = \\frac{1}{2} \\times AB \\times AC \\times \\sin A$</p><p>$S = \\frac{1}{2} \\times 5 \\times 8 \\times \\sin 60^\\circ$</p><p>$S = 20 \\times \\frac{\\sqrt{3}}{2} = 10\\sqrt{3}$</p><p>したがって、 $a = 10, \\ b = 3$ となります。</p>"
          }
        ]
      },
      "theorems": {
        "basic": [
          {
            questionHtml: "<p>三角形 $ABC$ において、 辺 $b = 4, \\ \\angle B = 45^\\circ, \\ \\angle A = 60^\\circ$ のとき、辺 $a$ の長さを求めなさい。</p><p>答えが $a'\\sqrt{b'}$ と表されるとき、自然数 $a', b'$ の値をそれぞれ求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="inline-input-row">
                  <span>a = </span>
                  <input type="text" id="ans_a" class="math-input very-short-input" aria-label="係数a">
                  <span>√</span>
                  <input type="text" id="ans_b" class="math-input very-short-input" aria-label="ルートの中身b">
                </div>
              `,
              fields: [
                { id: "ans_a", label: "係数a", allowedKeys: ["0-9"] },
                { id: "ans_b", label: "ルートの中身b", allowedKeys: ["0-9"] }
              ]
            },
            answers: { "ans_a": "2", "ans_b": "6" },
            correctAnswerTextHtml: "$a = 2\\sqrt{6}$",
            solutionHtml: "<p>正弦定理 $\\frac{a}{\\sin A} = \\frac{b}{\\sin B}$ を用います。</p><p>$\\frac{a}{\\sin 60^\\circ} = \\frac{4}{\\sin 45^\\circ}$</p><p>$a = \\frac{4 \\times \\sin 60^\\circ}{\\sin 45^\\circ}$</p><p>$a = \\frac{4 \\times \\frac{\\sqrt{3}}{2}}{\\frac{1}{\\sqrt{2}}} = 2\\sqrt{3} \\times \\sqrt{2} = 2\\sqrt{6}$</p><p>したがって、 $a' = 2, \\ b' = 6$ となります。</p>"
          },
          {
            questionHtml: "<p>三角形 $ABC$ において、 辺 $a = 3, \\ b = 5, \\ \\angle C = 120^\\circ$ のとき、辺 $c$ の長さを求めなさい。</p>",
            instruction: "解答を半角の整数で入力してください。",
            answerForm: {
              type: "number",
              fields: [
                { id: "ans", label: "辺cの長さ", allowedKeys: ["0-9"], placeholder: "例: 7" }
              ]
            },
            answers: { "ans": "7" },
            correctAnswerTextHtml: "$c = 7$",
            solutionHtml: "<p>余弦定理 $c^2 = a^2 + b^2 - 2ab \\cos C$ を用います。</p><p>$c^2 = 3^2 + 5^2 - 2 \\times 3 \\times 5 \\times \\cos 120^\\circ$</p><p>$c^2 = 9 + 25 - 30 \\times \\left(-\\frac{1}{2}\\right)$</p><p>$c^2 = 34 + 15 = 49$</p><p>$c &gt; 0$ であるため、 $c = \\sqrt{49} = 7$ となります。</p><p>したがって、辺 $c$ の長さは <strong>$7$</strong> です。</p>"
          }
        ],
        "standard": [
          {
            questionHtml: "<p>三角形 $ABC$ において、 辺の長さがそれぞれ $a = 7, \\ b = 5, \\ c = 3$ であるとき、角 $A$ の大きさ（度数法）を求めなさい。</p>",
            instruction: "解答を半角の整数で入力してください。単位（°）の入力は不要です。",
            answerForm: {
              type: "number",
              fields: [
                { id: "ans", label: "角Aの大きさ", allowedKeys: ["0-9"], placeholder: "例: 60" }
              ]
            },
            answers: { "ans": "120" },
            correctAnswerTextHtml: "$A = 120^\\circ$",
            solutionHtml: "<p>余弦定理 $\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}$ を用います。</p><p>$\\cos A = \\frac{5^2 + 3^2 - 7^2}{2 \\times 5 \\times 3}$</p><p>$\\cos A = \\frac{25 + 9 - 49}{30} = \\frac{-15}{30} = -\\frac{1}{2}$</p><p>$0^\\circ &lt; A &lt; 180^\\circ$ の範囲において、 $\\cos A = -\\frac{1}{2}$ となる角度は $120^\\circ$ です。</p><p>したがって、角 $A$ の大きさは <strong>$120^\\circ$</strong> です。</p>"
          },
          {
            questionHtml: "<p>三角形 $ABC$ において、 辺 $a = 5, \\ \\angle A = 30^\\circ$ であるとき、この三角形の外接円の半径 $R$ を求めなさい。</p>",
            instruction: "解答を半角の整数で入力してください。",
            answerForm: {
              type: "number",
              fields: [
                { id: "ans", label: "外接円の半径 R", allowedKeys: ["0-9"], placeholder: "例: 5" }
              ]
            },
            answers: { "ans": "5" },
            correctAnswerTextHtml: "$R = 5$",
            solutionHtml: "<p>正弦定理 $\\frac{a}{\\sin A} = 2R$ を用います。</p><p>$\\frac{5}{\\sin 30^\\circ} = 2R$</p><p>$\\frac{5}{1/2} = 2R \\implies 10 = 2R$</p><p>したがって、 $R = 5$ となります。</p>"
          }
        ],
        "advanced": [
          {
            questionHtml: "<p>辺の長さがそれぞれ $AB = 5, \\ BC = 7, \\ CA = 3$ であるような三角形 $ABC$ の外接円の半径 $R$ を求めなさい。</p><p>答えが $\\frac{a\\sqrt{b}}{c}$ と表されるとき、自然数 $a, b, c$ の値をそれぞれ求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="fraction-input-wrapper">
                  <div class="fraction-input-container">
                    <div class="fraction-numerator">
                      <input type="text" id="ans_a" class="math-input very-short-input" aria-label="係数a">
                      <span>√</span>
                      <input type="text" id="ans_b" class="math-input very-short-input" aria-label="ルートの中身b">
                    </div>
                    <div class="fraction-line"></div>
                    <div class="fraction-denominator">
                      <input type="text" id="ans_c" class="math-input very-short-input" aria-label="分母c">
                    </div>
                  </div>
                </div>
              `,
              fields: [
                { id: "ans_a", label: "係数a", allowedKeys: ["0-9"] },
                { id: "ans_b", label: "ルートの中身b", allowedKeys: ["0-9"] },
                { id: "ans_c", label: "分母c", allowedKeys: ["0-9"] }
              ]
            },
            answers: { "ans_a": "7", "ans_b": "3", "ans_c": "3" },
            correctAnswerTextHtml: "$R = \\frac{7\\sqrt{3}}{3}$",
            solutionHtml: "<p>まず、余弦定理により $\\cos A$ を求めます。（ $a = BC = 7, \\ b = CA = 3, \\ c = AB = 5$ ）</p><p>$\\cos A = \\frac{3^2 + 5^2 - 7^2}{2 \\times 3 \\times 5} = \\frac{9 + 25 - 49}{30} = -\\frac{1}{2}$</p><p>これにより、 $\\angle A = 120^\\circ$ と判明します。</p><p>次に、正弦定理 $\\frac{a}{\\sin A} = 2R$ を適用します。</p><p>$\\frac{7}{\\sin 120^\\circ} = 2R \\implies \\frac{7}{\\sqrt{3}/2} = 2R \\implies \\frac{14}{\\sqrt{3}} = 2R$</p><p>$R = \\frac{7}{\\sqrt{3}} = \\frac{7\\sqrt{3}}{3}$</p><p>したがって、 $a = 7, \\ b = 3, \\ c = 3$ となります。</p>"
          },
          {
            questionHtml: "<p>円に内接する四角形 $ABCD$ において、 辺の長さが $AB = 1, \\ BC = 2, \\ CD = 3, \\ DA = 4$ であるとき、 $\\cos B$ の値を求めなさい。</p><p>答えが $-\\frac{a}{b}$ と表されるとき、自然数 $a, b$ の値をそれぞれ求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。マイナスの入力は不要です。",
            answerForm: {
              type: "custom",
              html: `
                <div class="fraction-input-wrapper">
                  <div style="display: flex; align-items: center;">
                    <span class="math-operator" style="margin-right: 8px;">-</span>
                    <div class="fraction-input-container">
                      <div class="fraction-numerator">
                        <input type="text" id="ans_a" class="math-input very-short-input" aria-label="分子a">
                      </div>
                      <div class="fraction-line"></div>
                      <div class="fraction-denominator">
                        <input type="text" id="ans_b" class="math-input very-short-input" aria-label="分母b">
                      </div>
                    </div>
                  </div>
                </div>
              `,
              fields: [
                { id: "ans_a", label: "分子a", allowedKeys: ["0-9"] },
                { id: "ans_b", label: "分母b", allowedKeys: ["0-9"] }
              ]
            },
            answers: { "ans_a": "5", "ans_b": "7" },
            correctAnswerTextHtml: "$\\cos B = -\\frac{5}{7}$",
            solutionHtml: "<p>円に内接する四角形の対角の和は $180^\\circ$ なので、 $\\angle D = 180^\\circ - B$ です。</p><p>対角線 $AC$ の長さを2通りに表します。</p><p>1) $\\triangle ABC$ において余弦定理を適用：</p><p>$AC^2 = AB^2 + BC^2 - 2 \\times AB \\times BC \\times \\cos B$</p><p>$AC^2 = 1^2 + 2^2 - 2 \\times 1 \\times 2 \\times \\cos B = 5 - 4\\cos B$　…①</p><p>2) $\\triangle ADC$ において余弦定理を適用：</p><p>$AC^2 = DA^2 + CD^2 - 2 \\times DA \\times CD \\times \\cos(180^\\circ - B)$</p><p>$AC^2 = 4^2 + 3^2 - 2 \\times 4 \\times 3 \\times (-\\cos B)$ （ $\\cos(180^\\circ - X) = -\\cos X$ ）</p><p>$AC^2 = 16 + 9 + 24\\cos B = 25 + 24\\cos B$　…②</p><p>①と②は同じ $AC^2$ なので等式を作ります。</p><p>$5 - 4\\cos B = 25 + 24\\cos B$</p><p>$-28\\cos B = 20 \\implies \\cos B = -\\frac{20}{28} = -\\frac{5}{7}$</p><p>したがって、 $a = 5, \\ b = 7$ となります。</p>"
          }
        ]
      }
    },
    "data_analysis": {
      "stats": {
        "basic": [
          {
            questionHtml: "<p>5人の生徒の数学のテストの得点が、次のようでした。</p><p>$6, \\ 8, \\ 5, \\ 9, \\ 7$ （点）</p><p>このデータの平均値 $\\bar{x}$ と中央値 $M$ をそれぞれ求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="inline-input-row">
                  <span>平均値 x̄ = </span><input type="text" id="ans_avg" class="math-input very-short-input" aria-label="平均値">
                  <span>点 , </span>
                  <span>中央値 M = </span><input type="text" id="ans_med" class="math-input very-short-input" aria-label="中央値">
                  <span>点</span>
                </div>
              `,
              fields: [
                { id: "ans_avg", label: "平均値", allowedKeys: ["0-9"] },
                { id: "ans_med", label: "中央値", allowedKeys: ["0-9"] }
              ]
            },
            answers: { "ans_avg": "7", "ans_med": "7" },
            correctAnswerTextHtml: "平均値 $\\bar{x} = 7$ 点, $\\ $ 中央値 $M = 7$ 点",
            solutionHtml: "<p>平均値および中央値を求めます。</p><p>・平均値 $\\bar{x}$：</p><p>$\\bar{x} = \\frac{6 + 8 + 5 + 9 + 7}{5} = \\frac{35}{5} = 7$ 点</p><p>・中央値 $M$：</p><p>データを小さい順に並べ替えます。</p><p>$5, \\ 6, \\ \\mathbf{7}, \\ 8, \\ 9$</p><p>データ数は $5$ （奇数）なので、中央（ $3$ 番目）の値が中央値になります。</p><p>$M = 7$ 点</p>"
          },
          {
            questionHtml: "<p>6人の生徒の身長（cm）のデータが次のようでした。</p><p>$162, \\ 168, \\ 165, \\ 170, \\ 160, \\ 167$</p><p>このデータの中央値 $M$ を求めなさい。</p>",
            instruction: "解答を半角の整数で入力してください。",
            answerForm: {
              type: "number",
              fields: [
                { id: "ans", label: "中央値 M", allowedKeys: ["0-9"], placeholder: "例: 165" }
              ]
            },
            answers: { "ans": "166" },
            correctAnswerTextHtml: "中央値 $M = 166$ cm",
            solutionHtml: "<p>データを小さい順に並べ替えます。</p><p>$160, \\ 162, \\ \\mathbf{165}, \\ \\mathbf{167}, \\ 168, \\ 170$</p><p>データ数は $6$ （偶数）なので、中央にある $2$ つの値（ $3$ 番目と $4$ 番目）の平均が中央値になります。</p><p>$M = \\frac{165 + 167}{2} = \\frac{332}{2} = 166$ cm</p><p>したがって、中央値は <strong>$166$</strong> です。</p>"
          }
        ],
        "standard": [
          {
            questionHtml: "<p>次の $4$ つのデータの分散 $s^2$ を求めなさい。</p><p>$2, \\ 4, \\ 6, \\ 8$</p>",
            instruction: "解答を半角の整数で入力してください。",
            answerForm: {
              type: "number",
              fields: [
                { id: "ans", label: "分散 s^2", allowedKeys: ["0-9"], placeholder: "例: 5" }
              ]
            },
            answers: { "ans": "5" },
            correctAnswerTextHtml: "分散 $s^2 = 5$",
            solutionHtml: "<p>まず平均値 $\\bar{x}$ を求めます。</p><p>$\\bar{x} = \\frac{2 + 4 + 6 + 8}{4} = \\frac{20}{4} = 5$</p><p>次に、各データの「偏差（ $x - \\bar{x}$ ）」および「偏差の $2$ 乗」を計算します。</p><ul><li>$2 \\implies$ 偏差: $2 - 5 = -3 \\implies 2$乗: $9$</li><li>$4 \\implies$ 偏差: $4 - 5 = -1 \\implies 2$乗: $1$</li><li>$6 \\implies$ 偏差: $6 - 5 = 1 \\implies 2$乗: $1$</li><li>$8 \\implies$ 偏差: $8 - 5 = 3 \\implies 2$乗: $9$</li></ul><p>分散 $s^2$ は「偏差の $2$ 乗の平均値」です。</p><p>$s^2 = \\frac{9 + 1 + 1 + 9}{4} = \\frac{20}{4} = 5$</p><p>したがって、分散は <strong>$5$</strong> です。</p>"
          },
          {
            questionHtml: "<p>次の $5$ つのデータの標準偏差 $s$ を求めなさい。</p><p>$1, \\ 3, \\ 4, \\ 5, \\ 7$</p>",
            instruction: "解答を半角の整数で入力してください。",
            answerForm: {
              type: "number",
              fields: [
                { id: "ans", label: "標準偏差 s", allowedKeys: ["0-9"], placeholder: "例: 2" }
              ]
            },
            answers: { "ans": "2" },
            correctAnswerTextHtml: "標準偏差 $s = 2$",
            solutionHtml: "<p>平均値 $\\bar{x}$ を求めます。</p><p>$\\bar{x} = \\frac{1 + 3 + 4 + 5 + 7}{5} = \\frac{20}{5} = 4$</p><p>各データの「偏差の $2$ 乗」を求めます。</p><ul><li>$1 \\implies$ 偏差: $-3 \\implies 2$乗: $9$</li><li>$3 \\implies$ 偏差: $-1 \\implies 2$乗: $1$</li><li>$4 \\implies$ 偏差: $0 \\implies 2$乗: $0$</li><li>$5 \\implies$ 偏差: $1 \\implies 2$乗: $1$</li><li>$7 \\implies$ 偏差: $3 \\implies 2$乗: $9$</li></ul><p>分散 $s^2$ は「偏差の $2$ 乗の平均値」です。</p><p>$s^2 = \\frac{9 + 1 + 0 + 1 + 9}{5} = \\frac{20}{5} = 4$</p><p>標準偏差 $s$ は「分散の正の平方根」です。</p><p>$s = \\sqrt{s^2} = \\sqrt{4} = 2$</p><p>したがって、標準偏差は <strong>$2$</strong> となります。</p>"
          }
        ],
        "advanced": [
          {
            questionHtml: "<p>$10$ 個のデータの平均値が $6$、分散が $4$ でした。このデータの各値をすべて $2$ 倍し、さらに $3$ を加えた新しいデータの平均値 $\\bar{y}$ と分散 $s_y^2$ をそれぞれ求めなさい。</p>",
            instruction: "各欄に当てはまる半角の整数を入力してください。",
            answerForm: {
              type: "custom",
              html: `
                <div class="inline-input-row">
                  <span>新しい平均値 ȳ = </span><input type="text" id="ans_avg" class="math-input very-short-input" aria-label="平均値">
                  <span style="margin: 0 15px;">,</span>
                  <span>新しい分散 s_y^2 = </span><input type="text" id="ans_var" class="math-input very-short-input" aria-label="分散">
                </div>
              `,
              fields: [
                { id: "ans_avg", label: "平均値", allowedKeys: ["0-9"] },
                { id: "ans_var", label: "分散", allowedKeys: ["0-9"] }
              ]
            },
            answers: { "ans_avg": "15", "ans_var": "16" },
            correctAnswerTextHtml: "新しい平均値 $\\bar{y} = 15, \\ $ 新しい分散 $s_y^2 = 16$",
            solutionHtml: "<p>変数の変換 $y = ax + b$ における公式を用います。</p><p>元のデータの平均を $\\bar{x}$、分散を $s_x^2$ とすると、変換 $y = 2x + 3$ について、</p><p>・新平均 $\\bar{y} = 2\\bar{x} + 3$</p><p>$\\bar{y} = 2 \\times 6 + 3 = 12 + 3 = 15$</p><p>・新分散 $s_y^2 = 2^2 \\times s_x^2$ （定数の加算は分散に影響しません）</p><p>$s_y^2 = 4 \\times 4 = 16$</p><p>したがって、平均値は $15$、分散は $16$ となります。</p>"
          },
          {
            questionHtml: "<p>あるクラスの生徒を $2$ つのグループ A, B に分けました。 A グループは $5$ 人で平均点 $60$ 点、 B グループは $15$ 人で平均点 $80$ 点でした。</p><p>クラス全体（ $20$ 人）の平均点を求めなさい。</p>",
            instruction: "解答を半角の整数で入力してください。",
            answerForm: {
              type: "number",
              fields: [
                { id: "ans", label: "全体の平均点", allowedKeys: ["0-9"], placeholder: "例: 70" }
              ]
            },
            answers: { "ans": "75" },
            correctAnswerTextHtml: "全体の平均点 $75$ 点",
            solutionHtml: "<p>グループごとの合計得点を求め、それを全体の人数で割ります。</p><p>・ A グループの合計点： $5 \\text{人} \\times 60 \\text{点} = 300 \\text{点}$</p><p>・ B グループの合計点： $15 \\text{人} \\times 80 \\text{点} = 1200 \\text{点}$</p><p>・クラス全体の合計点： $300 + 1200 = 1500 \\text{点}$</p><p>・クラス全体の平均点： $\\frac{1500}{20} = 75$ 点</p><p>したがって、全体の平均点は <strong>$75$</strong> 点です。</p>"
          }
        ]
      },
      "correlation": {
        "basic": [
          {
            questionHtml: "<p>2つの変数 $x, \\ y$ のデータについて、共分散が $6$、 $x$ の標準偏差が $2$、 $y$ の標準偏差が $5$ であるとき、 $x$ と $y$ の相関係数 $r$ を求めなさい。</p>",
            instruction: "解答を半角の小数で入力してください。",
            answerForm: {
              type: "number",
              fields: [
                { id: "ans", label: "相関係数 r", allowedKeys: ["0-9", "."], placeholder: "例: 0.5" }
              ]
            },
            answers: { "ans": "0.6" },
            correctAnswerTextHtml: "相関係数 $r = 0.6$",
            solutionHtml: "<p>相関係数の公式 $r = \\frac{s_{xy}}{s_x s_y}$ （ $\\text{共分散} / (\\text{xの標準偏差} \\times \\text{yの標準偏差})$ ）を用います。</p><p>$r = \\frac{6}{2 \\times 5} = \\frac{6}{10} = 0.6$</p><p>したがって、相関係数は <strong>$0.6$</strong> です。</p>"
          },
          {
            questionHtml: "<p>2つの変数 $x, \\ y$ の散布図において、右上がりの傾向が強く見られるとき、相関係数 $r$ の値として最も適切なものを次から選びなさい。</p><p>① $1$ に近い正の値<br>② $-1$ に近い負の値<br>③ $0$ に近い値</p>",
            instruction: "選択肢をタップしてください。",
            answerForm: {
              type: "choice",
              options: ["①", "②", "③"]
            },
            answers: { "ans": "①" },
            correctAnswerTextHtml: "① (1 に近い正の値)",
            solutionHtml: "<p>散布図に「右上がりの傾向（ $x$ が増えると $y$ も増える）」があるとき、2つの変数には<strong>正の相関</strong>があります。</p><p>正の相関が強いほど、相関係数 $r$ は $1$ に近づきます。</p><p>したがって、最も適切な選択肢は <strong>①</strong> です。</p>"
          }
        ],
        "standard": [
          {
            questionHtml: "<p>3つのデータ対 $(x, y)$ がそれぞれ $(1, 2), \\ (2, 5), \\ (3, 5)$ であるとき、 $x$ と $y$ の共分散 $s_{xy}$ を求めなさい。</p>",
            instruction: "解答を半角の整数で入力してください。",
            answerForm: {
              type: "number",
              fields: [
                { id: "ans", label: "共分散 s_{xy}", allowedKeys: ["0-9", "-"], placeholder: "例: 1" }
              ]
            },
            answers: { "ans": "1" },
            correctAnswerTextHtml: "共分散 $s_{xy} = 1$",
            solutionHtml: "<p>まず、 $x$ と $y$ それぞれの平均値 $\\bar{x}, \\ \\bar{y}$ を求めます。</p><p>$\\bar{x} = \\frac{1 + 2 + 3}{3} = 2$</p><p>$\\bar{y} = \\frac{2 + 5 + 5}{3} = 4$</p><p>次に、データごとの「偏差の積」を求めます。</p><ul><li>$(1, 2) \\implies x$の偏差: $-1$, $y$の偏差: $-2 \\implies$ 積: $(-1) \\times (-2) = 2$</li><li>$(2, 5) \\implies x$の偏差: $0$, $y$の偏差: $1 \\implies$ 積: $0 \\times 1 = 0$</li><li>$(3, 5) \\implies x$の偏差: $1$, $y$の偏差: $1 \\implies$ 積: $1 \\times 1 = 1$</li></ul><p>共分散 $s_{xy}$ は「偏差の積の平均値」です。</p><p>$s_{xy} = \\frac{2 + 0 + 1}{3} = \\frac{3}{3} = 1$</p><p>したがって、共分散は <strong>$1$</strong> となります。</p>"
          },
          {
            questionHtml: "<p>2つの変数 $x, \\ y$ について、共分散が $4$、 $x$ の分散が $8$、 $y$ の分散が $8$ であるとき、 $x$ と $y$ の相関係数 $r$ を求めなさい。</p>",
            instruction: "解答を半角の小数で入力してください。",
            answerForm: {
              type: "number",
              fields: [
                { id: "ans", label: "相関係数 r", allowedKeys: ["0-9", "."], placeholder: "例: 0.5" }
              ]
            },
            answers: { "ans": "0.5" },
            correctAnswerTextHtml: "相関係数 $r = 0.5$",
            solutionHtml: "<p>相関係数の公式 $r = \\frac{s_{xy}}{s_x s_y}$ を用います。</p><p>分散が $8$ なので、標準偏差は $\\sqrt{8}$ です。</p><p>$r = \\frac{4}{\\sqrt{8} \\times \\sqrt{8}} = \\frac{4}{8} = 0.5$</p><p>したがって、相関係数は <strong>$0.5$</strong> となります。</p>"
          }
        ],
        "advanced": [
          {
            questionHtml: "<p>次の $4$ つのデータ対 $(x, y)$ について、相関係数 $r$ を求めなさい。</p><p>$(1, 2), \\ (2, 1), \\ (3, 4), \\ (4, 3)$</p>",
            instruction: "解答を半角の小数で入力してください。",
            answerForm: {
              type: "number",
              fields: [
                { id: "ans", label: "相関係数 r", allowedKeys: ["0-9", "."], placeholder: "例: 0.6" }
              ]
            },
            answers: { "ans": "0.6" },
            correctAnswerTextHtml: "相関係数 $r = 0.6$",
            solutionHtml: "<p>それぞれの平均値を求めます。</p><p>$\\bar{x} = 2.5, \\ \\bar{y} = 2.5$</p><p>各データの「偏差」「偏差の2乗」「偏差の積」を求めます。</p><ul><li>$(1, 2) \\implies x$の偏差: $-1.5$, $y$の偏差: $-0.5 \\implies x^2$: $2.25$, $y^2$: $0.25$, 積: $0.75$</li><li>$(2, 1) \\implies x$の偏差: $-0.5$, $y$の偏差: $-1.5 \\implies x^2$: $0.25$, $y^2$: $2.25$, 積: $0.75$</li><li>$(3, 4) \\implies x$の偏差: $0.5$, $y$の偏差: $1.5 \\implies x^2$: $0.25$, $y^2$: $2.25$, 積: $0.75$</li><li>$(4, 3) \\implies x$の偏差: $1.5$, $y$の偏差: $0.5 \\implies x^2$: $2.25$, $y^2$: $0.25$, 積: $0.75$</li></ul><p>・ $x$ の分散 $s_x^2 = \\frac{2.25 + 0.25 + 0.25 + 2.25}{4} = 1.25$</p><p>・ $y$ の分散 $s_y^2 = \\frac{0.25 + 2.25 + 2.25 + 0.25}{4} = 1.25$</p><p>・ 共分散 $s_{xy} = \\frac{0.75 \\times 4}{4} = 0.75$</p><p>・ 相関係数 $r = \\frac{0.75}{\\sqrt{1.25} \\times \\sqrt{1.25}} = \\frac{0.75}{1.25} = 0.6$</p><p>したがって、相関係数は <strong>$0.6$</strong> です。</p>"
          },
          {
            questionHtml: "<p>2つの変数 $x, \\ y$ の相関係数が $0.8$ でした。ここで、 $u = 2x + 1$、 $v = -3y + 2$ という新しい変数を作ったとき、 $u$ と $v$ の相関係数 $r_{uv}$ を求めなさい。</p>",
            instruction: "解答を半角の小数で入力してください。",
            answerForm: {
              type: "number",
              fields: [
                { id: "ans", label: "相関係数 r_uv", allowedKeys: ["0-9", ".", "-"], placeholder: "例: -0.8" }
              ]
            },
            answers: { "ans": "-0.8" },
            correctAnswerTextHtml: "相関係数 $r_{uv} = -0.8$",
            solutionHtml: "<p>変数の変換 $u = ax + b, \\ v = cy + d$ において、新変数間の相関係数 $r_{uv}$ と元の相関係数 $r_{xy}$ には次の関係があります。</p><p>$r_{uv} = \\frac{ac}{|ac|} r_{xy}$</p><p>つまり、 $a$ と $c$ の積の符号が「正」なら相関係数はそのまま、「負」なら符号が反転します。</p><p>ここでは $a = 2 &gt; 0$、 $c = -3 &lt; 0$ なので、積 $ac = -6 &lt; 0$ です。</p><p>したがって、符号が反転します。</p><p>$r_{uv} = -r_{xy} = -0.8$</p><p>よって、求める相関係数は <strong>$-0.8$</strong> です。</p>"
          }
        ]
      }
    }
  };

  return {
    // 章と単元の構成情報を取得
    getStructure: function() {
      return structure;
    },

    // 指定された章・単元・難易度からランダムに問題を1問生成
    // 固定バンク問題 + AIGenerator生成問題を合わせたプールから選択
    generate: function(chapterId, sectionId, difficulty) {
      // 固定問題バンク
      const fixedList = database[chapterId]?.[sectionId]?.[difficulty] || [];

      // AIGeneratorが利用可能なら追加問題を生成してプールに追加
      const aiList = [];
      if (typeof AIGenerator !== 'undefined' && AIGenerator.hasGenerator(chapterId, sectionId, difficulty)) {
        // AI生成問題を3問生成してプールに加える
        for (let i = 0; i < 3; i++) {
          try {
            const aiProblem = AIGenerator.generate(chapterId, sectionId, difficulty);
            if (aiProblem) aiList.push(aiProblem);
          } catch (e) {
            // 生成失敗は無視
          }
        }
      }

      const allProblems = [...fixedList, ...aiList];
      if (allProblems.length === 0) {
        throw new Error(`問題が見つかりません: ${chapterId} -> ${sectionId} -> ${difficulty}`);
      }

      // ランダムに1問選出
      const rawProblem = allProblems[Math.floor(Math.random() * allProblems.length)];

      // コピーして機能を追加して返却
      return {
        questionHtml: rawProblem.questionHtml,
        instruction: rawProblem.instruction,
        answerForm: rawProblem.answerForm,
        solutionHtml: rawProblem.solutionHtml,
        correctAnswerTextHtml: rawProblem.correctAnswerTextHtml,
        // Canvas描画関数（AIGenerator問題にある場合のみ）
        drawCanvas: rawProblem.drawCanvas || null,

        // 正誤判定ロジック（全角を半角に自動変換して判定）
        checkAnswer: function(userInputs) {
          for (let key in rawProblem.answers) {
            const normalizedUser = normalizeInput(userInputs[key]);
            const normalizedCorrect = normalizeInput(rawProblem.answers[key]);
            if (normalizedUser !== normalizedCorrect) {
              return false; // 1つでも違っていれば不正解
            }
          }
          return true; // すべて一致していれば正解
        }
      };
    }
  };

})();

