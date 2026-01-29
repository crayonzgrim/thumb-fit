export type Locale = 'en' | 'ko';

export const translations = {
  en: {
    // Header
    title: 'Thumb Fit',
    subtitle: 'Create perfect thumbnails for YouTube, Instagram & more',

    // Ratio Selector
    ratio: 'Ratio',
    youtube: 'YouTube',
    stories: 'Stories',
    square: 'Square',
    youtubeThumbnail: 'YouTube Thumbnail',
    instagramStories: 'Instagram/TikTok Stories',
    instagramPost: 'Instagram Post',

    // Image Uploader
    uploadImage: 'Upload Image',
    dragAndDrop: 'Drag and drop an image here',
    orClickToUpload: 'or click to upload',
    supportedFormats: 'PNG, JPG, GIF up to 10MB',
    changeImage: 'Change Image',
    removeImage: 'Remove',
    loading: 'Loading...',
    blurBackground: 'Blur Background',

    // Text Controls
    text: 'Text',
    textPlaceholder: 'Enter text overlay...',
    fontSize: 'Font Size',
    textColor: 'Text Color',
    positionOffset: 'Position',
    textRotation: 'Rotation',
    textBackground: 'Text Background',
    textBgColor: 'Background Color',
    textBgPaddingX: 'Horizontal Padding',
    textBgPaddingY: 'Vertical Padding',

    // Shadow Controls
    textShadow: 'Text Shadow',
    shadowEnabled: 'Enable Shadow',
    shadowColor: 'Shadow Color',
    shadowBlur: 'Blur',
    shadowOffsetX: 'Horizontal Offset',
    shadowOffsetY: 'Vertical Offset',

    // Templates
    templates: 'Templates',
    templateHint: 'Try various templates after entering text',
    applyTemplate: 'Apply',

    // Overlay Images
    addImage: 'Add Image',
    addImageHint: 'Add icons or stickers to your thumbnail',
    uploadIcon: 'Upload Image',
    addEmoji: 'Add Emoji',
    removeOverlay: 'Remove',
    noOverlayImages: 'No images added yet',
    doubleClickToAddText: 'Double-click to add text',
    enterText: 'Enter text...',

    // Export
    export: 'Export',
    exportAs: 'Export as',
    png: 'PNG',
    jpeg: 'JPEG',
    download: 'Download',

    // Custom Color
    customColor: 'Custom',
  },
  ko: {
    // Header
    title: 'Thumb Fit',
    subtitle: 'YouTube, Instagram 등을 위한 완벽한 썸네일 만들기',

    // Ratio Selector
    ratio: '비율',
    youtube: '유튜브',
    stories: '스토리',
    square: '정사각형',
    youtubeThumbnail: '유튜브 썸네일',
    instagramStories: '인스타그램/틱톡 스토리',
    instagramPost: '인스타그램 게시물',

    // Image Uploader
    uploadImage: '이미지 업로드',
    dragAndDrop: '이미지를 여기에 드래그 앤 드롭',
    orClickToUpload: '또는 클릭하여 업로드',
    supportedFormats: 'PNG, JPG, GIF 최대 10MB',
    changeImage: '이미지 변경',
    removeImage: '삭제',
    loading: '로딩 중...',
    blurBackground: '블러 배경',

    // Text Controls
    text: '텍스트',
    textPlaceholder: '텍스트를 입력하세요...',
    fontSize: '글꼴 크기',
    textColor: '텍스트 색상',
    positionOffset: '위치 조정',
    textRotation: '회전',
    textBackground: '텍스트 배경',
    textBgColor: '배경 색상',
    textBgPaddingX: '가로 여백',
    textBgPaddingY: '세로 여백',

    // Shadow Controls
    textShadow: '텍스트 그림자',
    shadowEnabled: '그림자 사용',
    shadowColor: '그림자 색상',
    shadowBlur: '흐림',
    shadowOffsetX: '가로 오프셋',
    shadowOffsetY: '세로 오프셋',

    // Templates
    templates: '템플릿',
    templateHint: '텍스트 입력 후 여러 종류의 템플릿을 사용해보세요',
    applyTemplate: '적용',

    // Overlay Images
    addImage: '이미지 추가',
    addImageHint: '썸네일에 아이콘이나 스티커를 추가하세요',
    uploadIcon: '이미지 업로드',
    addEmoji: '이모지 추가',
    removeOverlay: '삭제',
    noOverlayImages: '아직 추가된 이미지가 없습니다',
    doubleClickToAddText: '더블클릭하여 텍스트 추가',
    enterText: '텍스트 입력...',

    // Export
    export: '내보내기',
    exportAs: '형식으로 내보내기',
    png: 'PNG',
    jpeg: 'JPEG',
    download: '다운로드',

    // Custom Color
    customColor: '사용자 지정',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
