# PokéSurvivor 自動十連

**自己選好卡池，按 F8，它會一直幫你按十連。再按一次 F8 就停。**

這是瀏覽器遊戲 [PokéSurvivor](https://pokesurvivor.com) 的小工具。抽卡畫面下面那兩顆十連，哪顆還能按就按哪顆；抽完等結果出來，幫你按繼續，然後再抽下一次。

卡池要自己點。腳本不加票券，也不改機率。

Press F8 on the gacha screen and it keeps hitting ten-pull until you press F8 again, or the buttons can no longer be pressed.

## 怎麼裝

1. 瀏覽器裝 [Tampermonkey](https://www.tampermonkey.net/)。
2. 打開 [安裝腳本](https://github.com/Nathanlin3753/m2_poke/raw/main/pokesurvivor-auto-pull.user.js)，Tampermonkey 會問要不要安裝，選安裝。
3. 重新整理遊戲，進入 **Gacha**，自己點好地區（例如 Hoenn）。
4. 按 **F8** 開始。再按一次 **F8** 停止。

請用一般瀏覽器分頁，並讓這個分頁留在前景。切到別的分頁、或用裝到桌面的 App 時，動畫會變慢，腳本也可能停下來。

## 兩顆十連怎麼選

效果一樣，差在扣哪一種票。

| 按鈕 | 花費 |
| --- | --- |
| 中間那顆 | 10 張普通券 |
| 右邊那顆 | 1 張 ×10 券 |

兩顆都能按時，先按中間、花普通券。中間變灰之後，改按右邊。兩顆都灰了就停。左邊的單抽不會按。

每次十連會先跑拉霸，再翻出結果。腳本會等結果出來，停一下，按繼續，然後抽下一次。在結果畫面上按 F8，這一抽的結果會留著。

拉霸可以點一下加速，腳本預設會點。想看完整動畫，打開腳本，把最上面的 `SPEED_UP` 改成 `false`。

## 會在什麼時候停

- 再按一次 F8
- 兩種十連票都不夠了
- 抽卡畫面被關掉
- 這次結果等太久，沒有出現繼續

畫面上方會顯示現在是第幾次、用的是哪一種券。

## 想改手感

設定在 `pokesurvivor-auto-pull.user.js` 最上面。改完到 Tampermonkey 存檔，再重新整理遊戲。

| 設定 | 預設 | 作用 |
| --- | --- | --- |
| `HOTKEY` | `F8` | 開始和停止。F7 在 Firefox 會變成鍵盤瀏覽，所以不用 F7 |
| `PULL_BUTTONS` | 先普通券 | 兩顆都能按時的順序。想先花 ×10 券就把兩個名稱對調 |
| `SPEED_UP` | 開 | 點一下拉霸，走遊戲內建的加速 |
| `RESULT_PAUSE_MS` | `800` | 結果出來後，停多久再按繼續 |
| `GAP_MS` | `400` | 回到抽卡畫面後，隔多久按下一抽 |

粉絲做的點擊輔助，和 PokéSurvivor 作者、Pokémon 權利人無關。只在 `pokesurvivor.com` 的抽卡畫面動作。
