# PokéSurvivor 自動十連

自己選好地區卡池，按一下 **F8**，剩下的十連不用再一抽一抽點。

這是給瀏覽器遊戲 [PokéSurvivor](https://pokesurvivor.com) 用的小工具。它只幫忙按你本來就要按的十連按鈕，不選卡池、不加票券、也不改機率。票券還是得自己玩遊戲賺。

A small helper for the browser game PokéSurvivor. You pick the banner, press F8, and it repeats the ten-pull until those buttons can no longer be pressed.

## 怎麼用

1. 用 Chrome、Edge 或 Firefox，裝 [Tampermonkey](https://www.tampermonkey.net/)。
2. 把 `pokesurvivor-auto-pull.user.js` 拖進 Tampermonkey 的管理頁面，或新增腳本後把檔案內容貼上去，存檔。
3. 重新整理 [pokesurvivor.com](https://pokesurvivor.com)，進入 **Gacha**。
4. 自己點好要抽的地區（Kanto、Johto、Hoenn……）。腳本不會幫你換卡池。
5. 按 **F8** 開始。再按一次 **F8** 就停。

請用一般瀏覽器分頁玩，並讓這個分頁留在前景。裝成桌面 App、或把分頁切到背景時，動畫會變慢，腳本也可能中途停下來。

## 它會按哪一顆

抽卡畫面下面有兩顆十連，效果一樣，只是扣的票不同：

| 按鈕 | 花費 | 腳本裡的名稱 |
| --- | --- | --- |
| 中間 `Pull ×10` | 10 張普通券 | `pull-10` |
| 右邊 `Pull ×10` | 1 張 ×10 券 | `pull-10b` |

哪一顆還按得下去就按哪一顆。兩顆都能按時，預設先按中間、花普通券；普通券不夠、按鈕變灰之後，改按右邊的 ×10 券。兩顆都灰了就停。

單抽那顆不會按。

每一次十連遊戲都會先跑拉霸，再一張張翻出結果，最後才出現「繼續」。腳本會等結果出來、稍停一下、按繼續，然後再抽下一次。如果在結果畫面按 F8，這一抽的結果會留著，不會幫你關掉。

拉霸原本就可以點一下加速。腳本預設會點那一下，不然票券多的時候會等很久。想看完整動畫，把腳本最上面的 `SPEED_UP` 改成 `false`。

## 什麼時候會停

- 再按一次 F8
- 兩顆十連都不能按了（票券不夠）
- 抽卡畫面被關掉
- 這次抽卡等太久，沒有出現「繼續」

畫面上方會出現一行狀態，寫現在是第幾次、用的是哪一種券。

## 可以改的設定

都在 `pokesurvivor-auto-pull.user.js` 最上面：

| 設定 | 預設 | 作用 |
| --- | --- | --- |
| `HOTKEY` | `F8` | 開始 / 停止的按鍵。F7 在 Firefox 會打開「鍵盤瀏覽」，網頁腳本收不到 |
| `PULL_BUTTONS` | 先普通券，再 ×10 券 | 兩顆都能按時的順序。想先花 ×10 券就把兩個名稱對調 |
| `SPEED_UP` | `true` | 點一下拉霸，使用遊戲內建的加速 |
| `RESULT_PAUSE_MS` | `800` | 十張結果都出來後，停多久再按繼續。想看久一點就調大 |
| `GAP_MS` | `400` | 回到抽卡畫面後，隔多久按下一抽 |

改完在 Tampermonkey 存檔，重新整理遊戲頁面。

## 說明

- 這是粉絲做的點擊輔助，和 PokéSurvivor 作者、以及 Pokémon 權利人無關。
- 只在 `pokesurvivor.com` 的抽卡畫面動作。遊戲如果改了按鈕，腳本會停下來提示，不會改去點別的東西。
- 票券不能用真錢買，這個腳本也不會變出票券。
