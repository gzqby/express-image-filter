import { Request, Response, NextFunction } from "express";
// import { IncomingHttpHeaders } from "http";
import { URL } from "url";
// import QueryString from "qs";
import serveStatic from "serve-static";
import express from "express";

type TypeImageFilterConfig = {
  allowHost?: string[],
  // allow?: (headers: IncomingHttpHeaders, query: QueryString.ParsedQs) => boolean,
  // autoDownload?: boolean,
  blockNotImg?: boolean,
};

type TypeRequestAndResponse = {
  req: Request,
  res: Response,
}

type TypeRequestResponseAndNext = TypeRequestAndResponse & {
  next: NextFunction,
  cb: serveStatic.RequestHandler<express.Response<any, Record<string, any>>>,
}

const forbidenRes = (res: Response) => res.status(403).end('Forbiden')

const nextFunc = (blockNotImg: boolean, {
  cb,
  next,
  req,
  res,
}: TypeRequestResponseAndNext) => {
  if(blockNotImg || !cb) {
    next();
    return;
  }
  cb(req, res, next);
}

// const attachDownload = (attachDownload: TypeImageFilterConfig['autoDownload'], {res, req}: TypeRequestAndResponse) => {
//   if(attachDownload) {
//     const filename = /.*\/([^?]+)(?:\?.*|)$/g.exec(req.url)?.[1];
//     console.log(req.url, filename);
//     res.setHeader('Content-Disposition', `attachment;filename="${filename}"`);
//   }
// }

export default ({allowHost, blockNotImg=true}: TypeImageFilterConfig = {}, cb: serveStatic.RequestHandler<express.Response<any, Record<string, any>>>) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  // this is a condition that is it image?
  if(req.headers['sec-fetch-dest']==='image' && req.headers.referer ){
    // if (allow) {
    //   const isNext = allow(req.headers, req.query);
    //   if(isNext) {
    //     attachDownload(autoDownload, {res, req});
    //     getNextFunc<NextFunction, serveStatic.RequestHandler<express.Response<any, Record<string, any>>>>(next, cb)(req, res, next);
    //   }
    //   else forbidenRes(res);
    //   return;
    // }
    const reffererHost = new URL(req.headers.referer).host;
    
    if (allowHost) {
      if(allowHost.includes(reffererHost)) {
        nextFunc(!cb, {
          next,
          cb,
          req,
          res,
        })
      }else{
        forbidenRes(res);
      }
    }else if(reffererHost === req.headers?.host){
      nextFunc(!cb, {
        next,
        cb,
        req,
        res,
      })
    }else{
      forbidenRes(res);
    }
  }else{
    nextFunc(blockNotImg || !cb, {
      next,
      cb,
      req,
      res,
    })
  }
}
