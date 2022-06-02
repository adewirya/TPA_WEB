import { reject, resolve } from 'q';
import React from 'react';

export function ReadFile(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onerror = e => {
            reject(reader.error);
        };

        reader.onload = e => {
            resolve(reader.result as string);
        };
    });
}

export async function ReadFiles(files: FileList): Promise<string[]> {
    const promises = Array.from(files).map(f => ReadFile(f));
    const result = Promise.all(promises);
    return result;
}