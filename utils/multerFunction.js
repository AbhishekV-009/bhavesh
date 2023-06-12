import multer from "multer";
import fs from "fs"

function multerFunction(destination){
    if(fs.existsSync('./images')){
        const storage = multer.diskStorage({
            destination:function(req,file,cb){
                if(fs.existsSync(destination)){
                    cb(null,destination);
                }else{
                    fs.mkdirSync(destination)
                    cb(null,destination);
                }
            },
            filename:function(req,file,cb){
                cb(null,`${Date.now()}--${file.originalname}`)
            }
        })

        return multer({storage:storage});
    }else{
        fs.mkdirSync("./images");
        return multerFunction(destination)
    }
}

export default multerFunction