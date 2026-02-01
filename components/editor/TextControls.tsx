'use client';

import { useCanvasState } from '@/hooks/useCanvasState';
import { useI18n } from '@/lib/i18n';
import { Textarea } from '@/components/ui/Textarea';
import { Slider } from '@/components/ui/Slider';
import { ColorPicker } from '@/components/ui/ColorPicker';
import {
  FONT_SIZE_RANGE,
  POSITION_OFFSET_X_RANGE,
  POSITION_OFFSET_Y_RANGE,
  TEXT_BG_PADDING_X_RANGE,
  TEXT_BG_PADDING_Y_RANGE,
  ROTATION_RANGE,
  SHADOW_BLUR_RANGE,
} from '@/lib/constants';

export function TextControls() {
  const { state, dispatch } = useCanvasState();
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-4">
      {/* Text Content - Textarea for multi-line */}
      <Textarea
        label={t('text')}
        placeholder={t('textPlaceholder')}
        value={state.text.content}
        onChange={(e) =>
          dispatch({ type: 'SET_TEXT', payload: { content: e.target.value } })
        }
      />

      {/* Font Size */}
      <Slider
        label={t('fontSize')}
        min={FONT_SIZE_RANGE.min}
        max={FONT_SIZE_RANGE.max}
        step={FONT_SIZE_RANGE.step}
        value={state.text.fontSize}
        onChange={(e) =>
          dispatch({
            type: 'SET_TEXT',
            payload: { fontSize: Number(e.target.value) },
          })
        }
      />

      {/* Text Color & Style */}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <ColorPicker
            label={t('textColor')}
            value={state.text.color}
            onChange={(color) =>
              dispatch({ type: 'SET_TEXT', payload: { color } })
            }
          />
        </div>
        {/* Text Style Buttons */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() =>
              dispatch({
                type: 'SET_TEXT',
                payload: { style: { ...state.text.style, bold: !state.text.style.bold } },
              })
            }
            className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm font-bold transition-colors ${
              state.text.style.bold
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
            title={t('textStyleBold')}
          >
            B
          </button>
          <button
            type="button"
            onClick={() =>
              dispatch({
                type: 'SET_TEXT',
                payload: { style: { ...state.text.style, italic: !state.text.style.italic } },
              })
            }
            className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm italic transition-colors ${
              state.text.style.italic
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
            title={t('textStyleItalic')}
          >
            I
          </button>
          <button
            type="button"
            onClick={() =>
              dispatch({
                type: 'SET_TEXT',
                payload: { style: { ...state.text.style, underline: !state.text.style.underline } },
              })
            }
            className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm underline transition-colors ${
              state.text.style.underline
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
            title={t('textStyleUnderline')}
          >
            U
          </button>
          <button
            type="button"
            onClick={() =>
              dispatch({
                type: 'SET_TEXT',
                payload: { style: { ...state.text.style, strikethrough: !state.text.style.strikethrough } },
              })
            }
            className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm line-through transition-colors ${
              state.text.style.strikethrough
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
            title={t('textStyleStrikethrough')}
          >
            S
          </button>
        </div>
      </div>

      {/* Horizontal Position Offset Slider */}
      <Slider
        label={t('positionOffsetX')}
        min={POSITION_OFFSET_X_RANGE.min}
        max={POSITION_OFFSET_X_RANGE.max}
        step={POSITION_OFFSET_X_RANGE.step}
        value={state.text.positionOffsetX}
        onChange={(e) =>
          dispatch({
            type: 'SET_TEXT',
            payload: { positionOffsetX: Number(e.target.value) },
          })
        }
      />

      {/* Vertical Position Offset Slider */}
      <Slider
        label={t('positionOffsetY')}
        min={POSITION_OFFSET_Y_RANGE.min}
        max={POSITION_OFFSET_Y_RANGE.max}
        step={POSITION_OFFSET_Y_RANGE.step}
        value={state.text.positionOffsetY}
        onChange={(e) =>
          dispatch({
            type: 'SET_TEXT',
            payload: { positionOffsetY: Number(e.target.value) },
          })
        }
      />

      {/* Rotation Slider */}
      <Slider
        label={t('textRotation')}
        min={ROTATION_RANGE.min}
        max={ROTATION_RANGE.max}
        step={ROTATION_RANGE.step}
        value={state.text.rotation}
        onChange={(e) =>
          dispatch({
            type: 'SET_TEXT',
            payload: { rotation: Number(e.target.value) },
          })
        }
      />

      {/* Text Background Section */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
        <div className="flex flex-col gap-3">
          {/* Background Enable Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t('textBackground')}
            </label>
            <input
              type="checkbox"
              checked={state.text.background.enabled}
              onChange={(e) =>
                dispatch({
                  type: 'SET_TEXT',
                  payload: {
                    background: { ...state.text.background, enabled: e.target.checked },
                  },
                })
              }
              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          {state.text.background.enabled && (
            <>
              {/* Background Color */}
              <ColorPicker
                label={t('textBgColor')}
                value={state.text.background.color}
                onChange={(color) =>
                  dispatch({
                    type: 'SET_TEXT',
                    payload: {
                      background: { ...state.text.background, color },
                    },
                  })
                }
              />

              {/* Horizontal Padding */}
              <Slider
                label={t('textBgPaddingX')}
                min={TEXT_BG_PADDING_X_RANGE.min}
                max={TEXT_BG_PADDING_X_RANGE.max}
                step={TEXT_BG_PADDING_X_RANGE.step}
                value={state.text.background.paddingX}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_TEXT',
                    payload: {
                      background: {
                        ...state.text.background,
                        paddingX: Number(e.target.value),
                      },
                    },
                  })
                }
              />

              {/* Vertical Padding */}
              <Slider
                label={t('textBgPaddingY')}
                min={TEXT_BG_PADDING_Y_RANGE.min}
                max={TEXT_BG_PADDING_Y_RANGE.max}
                step={TEXT_BG_PADDING_Y_RANGE.step}
                value={state.text.background.paddingY}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_TEXT',
                    payload: {
                      background: {
                        ...state.text.background,
                        paddingY: Number(e.target.value),
                      },
                    },
                  })
                }
              />
            </>
          )}
        </div>
      </div>

      {/* Shadow Controls Section */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
        <div className="flex flex-col gap-3">
          {/* Shadow Enable Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t('textShadow')}
            </label>
            <input
              type="checkbox"
              checked={state.text.shadow.enabled}
              onChange={(e) =>
                dispatch({
                  type: 'SET_TEXT',
                  payload: {
                    shadow: { ...state.text.shadow, enabled: e.target.checked },
                  },
                })
              }
              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          {state.text.shadow.enabled && (
            <>
              {/* Shadow Color */}
              <ColorPicker
                label={t('shadowColor')}
                value={state.text.shadow.color.startsWith('rgba')
                  ? '#000000'
                  : state.text.shadow.color}
                onChange={(color) =>
                  dispatch({
                    type: 'SET_TEXT',
                    payload: {
                      shadow: { ...state.text.shadow, color },
                    },
                  })
                }
              />

              {/* Shadow Blur */}
              <Slider
                label={t('shadowBlur')}
                min={SHADOW_BLUR_RANGE.min}
                max={SHADOW_BLUR_RANGE.max}
                step={SHADOW_BLUR_RANGE.step}
                value={state.text.shadow.blur}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_TEXT',
                    payload: {
                      shadow: {
                        ...state.text.shadow,
                        blur: Number(e.target.value),
                      },
                    },
                  })
                }
              />

              {/* Shadow Offset X */}
              <Slider
                label={t('shadowOffsetX')}
                min={-30}
                max={30}
                step={1}
                value={state.text.shadow.offsetX}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_TEXT',
                    payload: {
                      shadow: {
                        ...state.text.shadow,
                        offsetX: Number(e.target.value),
                      },
                    },
                  })
                }
              />

              {/* Shadow Offset Y */}
              <Slider
                label={t('shadowOffsetY')}
                min={-30}
                max={30}
                step={1}
                value={state.text.shadow.offsetY}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_TEXT',
                    payload: {
                      shadow: {
                        ...state.text.shadow,
                        offsetY: Number(e.target.value),
                      },
                    },
                  })
                }
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
