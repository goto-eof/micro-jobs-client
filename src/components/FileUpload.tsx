import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';

interface Props {
  callback: (files: Array<any>) => void;
}

function FileUpload({ callback }: Props) {
  const [file, setFile] = useState<File>();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);

      const files = new Array<any>();
      for (let i = 0; i < e.target.files.length; i++) {
        convertBase64(e.target.files[i]).then((fileString: any) => {
          files.push(fileString);
          console.log(fileString);
        });
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
      <FormLabel>Upload screenshots</FormLabel>
      <Input type="file" onChange={(e) => handleFileChange(e)} multiple />
      <div>{file && `${file.name} - ${file.type}`}</div>
    </FormControl>
  );
}

export default FileUpload;
