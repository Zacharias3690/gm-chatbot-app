import * as DocumentPicker from 'expo-document-picker';
import {Platform} from "react-native";

interface UploadOptions {
    onSuccess?: (filename: string) => void;
    onError?: (error: string) => void;
    onStart?: (filename: string) => void;
}

export function usePdfUpload() {
    const uploadPdf = async (options?: UploadOptions) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true
            });
            
            if (result.assets && result.assets.length > 0) {
                const file = result.assets[0];
                options?.onStart?.(file.name);

                // Create form data
                const formData = new FormData();
                
                // For web, we need to get the actual file
                if (Platform.OS === 'web') {
                    // Convert base64 to blob
                    const response = await fetch(file.uri);
                    const blob = await response.blob();
                    formData.append('file', blob, file.name);
                } else {
                    formData.append('file', {
                        uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
                        type: 'application/pdf',
                        name: file.name,
                    } as any);
                }

                try {
                    const response = await fetch('http://64.23.133.29/upload', {
                        method: 'POST',
                        body: formData,
                    });

                    if (response.ok) {
                        options?.onSuccess?.(file.name);
                    } else {
                        const errorText = await response.text();
                        console.error('Upload failed:', errorText);
                        options?.onError?.(errorText);
                    }
                } catch (error) {
                    console.error('Upload error:', error);
                    options?.onError?.('Failed to upload file');
                }
            }
        } catch (error) {
            console.error('Error picking document:', error);
            options?.onError?.('Failed to select PDF');
        }
    };

    return { uploadPdf };
} 