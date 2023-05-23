import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';

interface Props {
  callback: (files: Array<any>) => void;
  multiple: boolean;
  required: boolean;
}

function FileUpload({ callback, multiple, required }: Props) {
  const [file, setFile] = useState<File>();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);

      const files = new Array<any>();
      for (let i = 0; i < e.target.files.length; i++) {
        let b64 = await convertBase64(e.target.files[i]);
        files.push(b64);
      }
      callback(files);
    }
  };

  const convertBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <FormControl isRequired>
      <FormLabel>Upload images</FormLabel>
      <Input
        type="file"
        onChange={(e) => handleFileChange(e)}
        accept="image/png, image/gif, image/jpeg"
        multiple={multiple}
        required={required}
      />
      <div>{file && `${file.name} - ${file.type}`}</div>
    </FormControl>
  );
}

export default FileUpload;
