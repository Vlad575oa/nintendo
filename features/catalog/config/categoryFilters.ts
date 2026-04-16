export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterSectionConfig {
  id: string;
  title: string;
  paramKey: string;
  options: FilterOption[];
}

export const CATEGORY_FILTERS: Record<string, FilterSectionConfig[]> = {
  playstation: [
    {
      id: "ps_model",
      title: "Модель",
      paramKey: "attr_model",
      options: [
        { label: "PlayStation 5", value: "PlayStation 5" },
        { label: "PlayStation 5 Digital Edition", value: "PlayStation 5 Digital Edition" },
        { label: "PlayStation 5 Pro", value: "PlayStation 5 Pro" },
        { label: "PlayStation 5 Slim", value: "PlayStation 5 Slim" },
        { label: "PlayStation 5 Slim Digital Edition", value: "PlayStation 5 Slim Digital Edition" },
        { label: "PlayStation Portal Remote Player", value: "PlayStation Portal Remote Player" },
      ],
    },
    {
      id: "ps_compatibility",
      title: "Совместимость",
      paramKey: "attr_compatibility",
      options: [
        { label: "PlayStation 5", value: "PlayStation 5" },
        { label: "PlayStation 5 Slim", value: "PlayStation 5 Slim" },
        { label: "PlayStation 5 Pro", value: "PlayStation 5 Pro" },
      ],
    },
    {
      id: "ps_storage",
      title: "Объём встроенной памяти",
      paramKey: "attr_storage",
      options: [
        { label: "825 GB", value: "825GB" },
        { label: "1 TB", value: "1TB" },
        { label: "2 TB", value: "2TB" },
      ],
    },
    {
      id: "ps_ram",
      title: "Объём оперативной памяти",
      paramKey: "attr_ram",
      options: [
        { label: "16 GB", value: "16GB" },
      ],
    },
    {
      id: "ps_connectivity",
      title: "Тип связи",
      paramKey: "attr_connectivity",
      options: [
        { label: "Bluetooth", value: "Bluetooth" },
        { label: "Wi-Fi", value: "Wi-Fi" },
        { label: "USB", value: "USB" },
      ],
    },
    {
      id: "ps_consoleType",
      title: "Тип приставки",
      paramKey: "attr_consoleType",
      options: [
        { label: "Стационарная", value: "Стационарная" },
        { label: "Портативная", value: "Портативная" },
      ],
    },
    {
      id: "ps_country",
      title: "Страна",
      paramKey: "attr_country",
      options: [
        { label: "Европа", value: "Европа" },
        { label: "Китай", value: "Китай" },
        { label: "Россия", value: "Россия" },
        { label: "Япония", value: "Япония" },
      ],
    },
    {
      id: "ps_mediaType",
      title: "Тип носителя",
      paramKey: "attr_mediaType",
      options: [
        { label: "Blu-ray диск", value: "Blu-ray" },
        { label: "Только цифровые игры", value: "Digital" },
      ],
    },
    {
      id: "ps_bundled",
      title: "Товары в комплекте",
      paramKey: "attr_bundled",
      options: [
        { label: "Карта памяти", value: "Карта памяти" },
        { label: "Второй геймпад", value: "Второй геймпад" },
        { label: "Видеоигра", value: "Видеоигра" },
        { label: "Наушники", value: "Наушники" },
        { label: "Зарядная станция", value: "Зарядная станция" },
        { label: "Подписка", value: "Подписка" },
        { label: "VR", value: "VR" },
        { label: "Руль", value: "Руль" },
        { label: "Дисковод", value: "Дисковод" },
      ],
    },
    {
      id: "ps_design",
      title: "Дизайн",
      paramKey: "attr_design",
      options: [
        { label: "Limited Edition", value: "Limited Edition" },
        { label: "Кастомный", value: "Кастомный" },
        { label: "Стандартный", value: "Стандартный" },
      ],
    },
  ],

  xbox: [
    {
      id: "xbox_model",
      title: "Модель",
      paramKey: "attr_model",
      options: [
        { label: "Xbox Series X", value: "Xbox Series X" },
        { label: "Xbox Series X 2TB", value: "Xbox Series X 2TB" },
        { label: "Xbox Series S", value: "Xbox Series S" },
        { label: "Xbox Series S 1TB", value: "Xbox Series S 1TB" },
      ],
    },
    {
      id: "xbox_storage",
      title: "Объём встроенной памяти",
      paramKey: "attr_storage",
      options: [
        { label: "512 GB", value: "512GB" },
        { label: "1 TB", value: "1TB" },
        { label: "2 TB", value: "2TB" },
      ],
    },
    {
      id: "xbox_connectivity",
      title: "Тип связи",
      paramKey: "attr_connectivity",
      options: [
        { label: "Bluetooth", value: "Bluetooth" },
        { label: "Wi-Fi", value: "Wi-Fi" },
        { label: "USB", value: "USB" },
      ],
    },
    {
      id: "xbox_consoleType",
      title: "Тип приставки",
      paramKey: "attr_consoleType",
      options: [
        { label: "Стационарная", value: "Стационарная" },
      ],
    },
    {
      id: "xbox_country",
      title: "Страна",
      paramKey: "attr_country",
      options: [
        { label: "Европа", value: "Европа" },
        { label: "Китай", value: "Китай" },
        { label: "Россия", value: "Россия" },
        { label: "США", value: "США" },
      ],
    },
    {
      id: "xbox_mediaType",
      title: "Тип носителя",
      paramKey: "attr_mediaType",
      options: [
        { label: "Blu-ray диск", value: "Blu-ray" },
        { label: "Только цифровые игры", value: "Digital" },
      ],
    },
    {
      id: "xbox_bundled",
      title: "Товары в комплекте",
      paramKey: "attr_bundled",
      options: [
        { label: "Второй геймпад", value: "Второй геймпад" },
        { label: "Игровая подписка", value: "Игровая подписка" },
        { label: "Зарядная станция", value: "Зарядная станция" },
        { label: "Гарнитура", value: "Гарнитура" },
      ],
    },
    {
      id: "xbox_design",
      title: "Дизайн",
      paramKey: "attr_design",
      options: [
        { label: "Limited Edition", value: "Limited Edition" },
        { label: "Кастомный", value: "Кастомный" },
        { label: "Стандартный", value: "Стандартный" },
      ],
    },
  ],

  nintendo: [
    {
      id: "ns_model",
      title: "Модель",
      paramKey: "attr_model",
      options: [
        { label: "Nintendo Switch", value: "Nintendo Switch" },
        { label: "Nintendo Switch Lite", value: "Nintendo Switch Lite" },
        { label: "Nintendo Switch OLED", value: "Nintendo Switch OLED" },
      ],
    },
    {
      id: "ns_storage",
      title: "Объём встроенной памяти",
      paramKey: "attr_storage",
      options: [
        { label: "32 GB", value: "32GB" },
        { label: "64 GB", value: "64GB" },
      ],
    },
    {
      id: "ns_connectivity",
      title: "Тип связи",
      paramKey: "attr_connectivity",
      options: [
        { label: "Bluetooth", value: "Bluetooth" },
        { label: "Wi-Fi", value: "Wi-Fi" },
        { label: "NFC", value: "NFC" },
      ],
    },
    {
      id: "ns_consoleType",
      title: "Тип приставки",
      paramKey: "attr_consoleType",
      options: [
        { label: "Стационарная", value: "Стационарная" },
        { label: "Портативная", value: "Портативная" },
        { label: "Гибридная", value: "Гибридная" },
      ],
    },
    {
      id: "ns_country",
      title: "Страна",
      paramKey: "attr_country",
      options: [
        { label: "Европа", value: "Европа" },
        { label: "Япония", value: "Япония" },
        { label: "США", value: "США" },
        { label: "Россия", value: "Россия" },
      ],
    },
    {
      id: "ns_mediaType",
      title: "Тип носителя",
      paramKey: "attr_mediaType",
      options: [
        { label: "Картридж", value: "Картридж" },
        { label: "Только цифровые игры", value: "Digital" },
      ],
    },
    {
      id: "ns_bundled",
      title: "Товары в комплекте",
      paramKey: "attr_bundled",
      options: [
        { label: "Игра", value: "Игра" },
        { label: "Чехол", value: "Чехол" },
        { label: "Зарядная станция", value: "Зарядная станция" },
        { label: "Карта памяти", value: "Карта памяти" },
        { label: "Второй Joy-Con", value: "Второй Joy-Con" },
      ],
    },
    {
      id: "ns_design",
      title: "Дизайн",
      paramKey: "attr_design",
      options: [
        { label: "Limited Edition", value: "Limited Edition" },
        { label: "Кастомный", value: "Кастомный" },
        { label: "Стандартный", value: "Стандартный" },
      ],
    },
  ],
};
