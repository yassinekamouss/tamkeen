export type StudioTabKey = "JSON" | "DOCS" | "REQUESTS" | "STEPPER" | "POSTULATION";

export interface StudioPieceItem {
    docTypeId: number | null;
    label: string;
    isRequired: boolean;
    hasUploadedFile: boolean;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    uploadedDate: string;
    requirementId?: number;
    pendingRequest?: any;
    isRequested?: boolean;
}

export interface ReplacementModalState {
    isOpen: boolean;
    docTypeId: number | null;
    docTypeName: string;
    clarification: string;
}
