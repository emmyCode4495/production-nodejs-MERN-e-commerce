import multer from 'multer'

const storage = multer.memoryStorage()

export const singleLineUp = multer({storage}).single('file')

