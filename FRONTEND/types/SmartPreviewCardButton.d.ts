export type SmartPreviewCardActionButton = {
    label: string;
    onPress: () => void;
    backgroundColor: string;
    labelColor: string;
    accessibilityLabel: string;
    isLoading?: boolean | undefined;
    icon?: string; // The icon name (e.g., "edit", "trash")
    iconSet?: 'MaterialIcons' | 'AntDesign' | 'Ionicons' | 'Feather'; // The icon set
  };