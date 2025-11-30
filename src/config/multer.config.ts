import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerPersonaConfig = {
  storage: diskStorage({
    destination: './uploads/personas',
    filename: (req, file, callback) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, unique + ext);
    },
  }),
};
