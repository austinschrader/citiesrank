declare module 'piexifjs' {
  interface ExifIFD {
    DateTimeOriginal: number;
    UserComment: number;
  }

  interface GPSIFD {
    GPSLatitudeRef: number;
    GPSLatitude: number;
    GPSLongitudeRef: number;
    GPSLongitude: number;
  }

  interface PiexifStatic {
    ExifIFD: ExifIFD;
    GPSIFD: GPSIFD;
    dump: (exifObj: any) => string;
    insert: (exifbytes: string, jpeg: string) => string;
  }

  const piexif: PiexifStatic;
  export default piexif;
}
