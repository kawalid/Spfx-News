import { DisplayMode } from '@microsoft/sp-core-library';
export const useIsEditMode = (mode: DisplayMode): boolean => mode === DisplayMode.Edit;