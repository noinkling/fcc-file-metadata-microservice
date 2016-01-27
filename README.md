## <small>Free Code Camp API project</small>
# File Metadata Microservice

Made according to the instructions here:  
http://www.freecodecamp.com/challenges/file-metadata-microservice

## Usage

```
$ npm install
$ npm start
```

## Client usage

Select the file you want info for using dialog and click "Upload".

### Response format

JSON object in the form:

```
{
  "name": "todolist.txt",
  "size": 9001
}
```

Size is in bytes.
