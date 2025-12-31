const RadioGroup = 1
enum NeoPixelColorsPlus {
    //% block=赤
    Red = 0xFF0000,
    //% block=オレンジ
    Orange = 0xFF6A00,
    //% block=黄
    Yellow = 0xFFE800,
    //% block=緑
    Green = 0x006400,
    //% block=黄緑
    YellowGreen = 0x55FF00,
    //% block=藍
    Indigo = 0x101989,
    //% block=青
    Blue = 0x0000FF,
    //% block=水色
    WaterBlue = 0x2255FF,
    //% block=紫
    Purple = 0x7700FF,
    //% block=ピンク
    Pink = 0xEE33EE,
    //% block=白
    White = 0xFFFFFF,
    //% block=消
    None = null
}

enum Palette {
    //% block="パレット1"
    PALETTE1 = 0,
    //% block="パレット2"
    PALETTE2 = 1,
    //% block="パレット3"
    PALETTE3 = 2,
    //% block="パレット4"
    PALETTE4 = 3,
    //% block="パレット5"
    PALETTE5 = 4,
    //% block="パレット6"
    PALETTE6 = 5
}

enum PaletteColor {
    //% block="カラー1"
    PaletteColor1 = 0,
    //% block="カラー2"
    PaletteColor2 = 1,
    //% block="カラー3"
    PaletteColor3 = 2,
    //% block="カラー4"
    PaletteColor4 = 3,
    //% block="カラー5"
    PaletteColor5 = 4,
    //% block="カラー6"
    PaletteColor6 = 5
}

const PaletteColorColors: { [key: number]: Array<number> } = {
    0: [
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None
    ],
    1: [
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None
    ],
    2: [
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None
    ],
    3: [
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None
    ],
    4: [
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None
    ],
    5: [
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None,
        NeoPixelColorsPlus.None
    ]
};

/*
 * ライトトワリング v1
 */
//% weight=100 color=#9400D3 icon="\uf005" block="ライトトワリング v1"
namespace light_twirling_v1 {
    let mltStrip1: neopixel.Strip = neopixel.create(DigitalPin.P0, 6, NeoPixelMode.RGB)
    // backward compatibility
    let mltStrip2: neopixel.Strip = neopixel.create(DigitalPin.P1, 3, NeoPixelMode.RGB)

    let currentPalette: Palette = Palette.PALETTE1
    let currentPaletteColor: PaletteColor = null
    let lastLedValue: number | null = null

    const ModeAlwaysOn = 1
    const ModeBlink = 2
    let currentMode = ModeAlwaysOn

    let latestSerialNo = 0

    let remoteControlled = false

    const paletteLen = Object.keys(PaletteColorColors).length
    const colorLen = PaletteColorColors[0].length

    radio.setGroup(RadioGroup)
    radio.setTransmitPower(7)
    _turnOffLed()

    let _isColorPlotted = false;
    const _plotColor = (color: number) => {
        for (let i = 0; i < 6; i++) {
            const x = i % 5
            const y = Math.floor(i / 5) + 2
            if (i !== color) led.unplot(x, y)
            else led.plot(x, y)
        }
        _isColorPlotted = true;
    }

    let _isPalettePlotted = false;
    const _plotPalette = (palette: number) => {
        for (let i = 0; i < 6; i++) {
            const x = i % 5
            const y = Math.floor(i / 5)
            if (i !== palette) led.unplot(x, y)
            else led.plot(x, y)
        }
        _isPalettePlotted = true;
    }

    function _litLed(color: number): void {
        if (color === NeoPixelColorsPlus.None) {
            _turnOffLed()
        } else {
            mltStrip1.showColor(color)
            mltStrip2.showColor(color)
        }
        if (!remoteControlled) {
            basic.clearScreen()
            _plotPalette(currentPalette)
            _plotColor(currentPaletteColor)
        }
    }

    function _turnOffLed(): void {
        mltStrip1.clear()
        mltStrip1.show()
        mltStrip2.clear()
        mltStrip2.show()
    }

    function _setRemoteControlled(value: boolean): void {
        if (!remoteControlled && value) {
            basic.clearScreen()
            _plotPalette(-1)
            _plotColor(-1)
        }
        remoteControlled = value
    }

    input.onButtonPressed(Button.A, function () {
        if (remoteControlled) return;

        if (currentPaletteColor === null) {
            currentPaletteColor = PaletteColor.PaletteColor1
        } else {
            currentPaletteColor = (currentPaletteColor + 1) % colorLen
        }
        _litLed(PaletteColorColors[currentPalette][currentPaletteColor])
    })

    input.onButtonPressed(Button.B, function () {
        if (remoteControlled) return;

        if (currentPaletteColor === null) {
            currentPaletteColor = PaletteColor.PaletteColor6
        } else {
            if (currentPaletteColor <= 0) currentPaletteColor = colorLen
            currentPaletteColor = (currentPaletteColor - 1) % colorLen
        }
        _litLed(PaletteColorColors[currentPalette][currentPaletteColor])
    })

    radio.onReceivedValue(function (name, valueWithSerialNo: number) {
        if (name === "init") {
            latestSerialNo = 0
            currentMode = ModeAlwaysOn
            _turnOffLed()
            return
        }
        const serialNo: number = Math.floor(valueWithSerialNo / 100)
        const value = valueWithSerialNo % 100

        if (serialNo <= latestSerialNo) return;

        //serial.writeValue(name, value)

        if (name === "mode") {
            currentMode = value
            if (currentMode == ModeAlwaysOn) {
                _litLed(PaletteColorColors[currentPalette][currentPaletteColor])
            }
        } else if (name === "led") {
            _setRemoteControlled(true)
            if (lastLedValue === value) return;
            lastLedValue = value;
            currentPalette = Math.floor(value / 10.0) | 0
            currentPaletteColor = value - currentPalette * 10
            if (currentMode === ModeAlwaysOn) {
                if (currentPalette < colorLen) {
                    _litLed(PaletteColorColors[currentPalette][currentPaletteColor])
                } else {
                    _turnOffLed()
                }
            }
        } else if (name === "blink") {
            if (value === 1) {
                _litLed(PaletteColorColors[currentPalette][currentPaletteColor])
            } else {
                _turnOffLed()
            }
        }
    })

    /*
     * カラーを指定した色に設定します
     */
    //% block="$palette の$paletteColor を$color=neo_pixel_colors_plus にする"
    //% weight=100
    export function setPaletteColorColor(palette: Palette, paletteColor: PaletteColor, color: number): void {
        if (!color) return
        PaletteColorColors[palette][paletteColor] = color

        // set the last designated palette as a current palette.
        currentPalette = palette
    }

    /*
     * LEDの色を選択します
     */
    //% blockId="neo_pixel_colors_plus" block="%color"
    //% weight=90
    export function colors(color: NeoPixelColorsPlus): number {
        return color
    }

    /*
     * カラーコード(#FF00FFのようなコード)を色に変換します
     */
    //% block="カラーコード%colorCode|を色に変換"
    //% weight=80
    export function convertColorCode(colorCode: string): number {
        let sanitized = false
        while (!sanitized) {
            if (colorCode.length > 0 && (colorCode[0] === '#' || colorCode[0] === ' ')) {
                colorCode = colorCode.slice(1)
            } else {
                sanitized = true
            }
        }
        return parseInt(colorCode, 16)
    }
}
