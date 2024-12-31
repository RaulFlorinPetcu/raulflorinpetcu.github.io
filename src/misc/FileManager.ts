import fs from 'fs';

class FileManager {
    static delete_file(file_path: string) {
        fs.unlink(file_path, (err)=> {
            if(err) {
                console.log(err)
            }
        })
    }
}

export default FileManager;