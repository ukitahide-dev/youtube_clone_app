

// ----css----
import FileInputStyles from './FileInput.module.css';




// 親: UploadVideoForm.jsx
// 役割:



function FileInput({ label, accept, onChange, file, variant}) {

    // variantの値によってクラス名を変える。
    const labelClass = `${FileInputStyles.fileLabel} ${
        variant === 'thumbnail' ? FileInputStyles.fileLabelThumb : ''
    }`.trim();



    return (
        <div className={FileInputStyles.fileBlock}>
            <label className={labelClass}>
                {label}
                <input
                    type="file"
                    accept={accept}
                    onChange={(e) => onChange(e.target.files[0])}
                    className={FileInputStyles.fileInput}
                />
            </label>

            {file && <p className={FileInputStyles.fileName}>{file.name}</p>}
        </div>
    );



}


export default FileInput;
