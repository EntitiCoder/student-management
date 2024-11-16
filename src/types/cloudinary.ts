// Sample interface
// asset_id: '2e0b3c505823486581d9c7cf850f6792',
//   public_id: 'kalizas35dep0mfk15ic',
//   version: 1731238325,
//   version_id: '28656f885da3fbda47c3afb93cb96658',
//   signature: 'e1563c2eb01928ed8fa2880c0b96a4bf0c4df15c',
//   width: 3600,
//   height: 2400,
//   format: 'jpg',
//   resource_type: 'image',
//   created_at: '2024-11-10T11:32:05Z',
//   tags: [],
//   bytes: 1846708,
//   type: 'upload',
//   etag: 'a17d80db20c3464173d227ad08a1494a',
//   placeholder: false,
//   url: 'http://res.cloudinary.com/dxucktn2g/image/upload/v1731238325/kalizas35dep0mfk15ic.jpg',
//   secure_url: 'https://res.cloudinary.com/dxucktn2g/image/upload/v1731238325/kalizas35dep0mfk15ic.jpg',
//   folder: '',
//   access_mode: 'public',
//   original_filename: 'file',
//   api_key: '627215598775438'

interface CloudinaryUploadResponse {
  asset_id?: string;
  public_id: string;
  version: number;
  version_id?: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder?: string;
  access_mode: string;
  original_filename: string;
  api_key?: string;
}

enum MediaType {
  IMAGE = 'image/jpeg',
  PDF = 'application/pdf',
}

interface FileUpload {
  id?: number;
  url: string;
  type: string;
  fileName: string;
}
