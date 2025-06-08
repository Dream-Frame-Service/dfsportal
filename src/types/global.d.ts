// Global type declarations for the DFS Manager Portal

declare global {
  interface Window {
    ezsite: {
      apis: {
        tablePage: (tableId: string | number, request: any) => Promise<any>;
        tableCreate: (tableId: string | number, data: any) => Promise<any>;
        tableUpdate: (tableId: string | number, data: any) => Promise<any>;
        tableDelete: (tableId: string | number, data: any) => Promise<any>;
        getUserInfo: () => Promise<any>;
        register: (credentials: { email: string; password: string }) => Promise<any>;
        sendEmail: (emailData: any) => Promise<any>;
        upload: (uploadData: { filename: string; file: File }) => Promise<any>;
      };
    };
  }
}

export {};
