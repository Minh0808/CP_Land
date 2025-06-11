/// <reference types="vite/client" />
// Khai báo để TypeScript hiểu được import “*.json”
declare module "*.json" {
   const value: any;
   export default value;
}