import { ReplaySubject } from "rxjs/ReplaySubject";
import { OrderedMap } from "immutable";
import { IMessage } from "./IMessage";
/**
 * channel类 表示消息总线中对频道
 */
export class Channel {
    //   private _channel: ReplaySubject<T>;
    //   private _channelBus: Observable<T>;
    private _subjects: OrderedMap<string, ReplaySubject<IMessage>>;
    constructor() {
      // this._channel = new ReplaySubject<T>();
      // this._channelBus = this._channel.pipe(publishReplay(), refCount());
      this._subjects = OrderedMap<string, ReplaySubject<IMessage>>();
    }
    private setSubject(topic: string) {
      if (!this._subjects.has(topic)) {
        this._subjects = this._subjects.set(
          topic,
          new ReplaySubject<IMessage>(1)
        );
      }
    }
    from(name: string) {
      // if (name.indexOf("*") === -1 && name.indexOf("#") === -1) {
      //     this.setSubject(name);
      //   return this._subjects.get(name).asObservable();
      // } else {
      //   let subjects = this._subjects.filter((value,topic) => {
      //     if(topic){
      //         return compareTopics(topic,name);
      //     }
      //     else{ return false}
      //   });
      //   return combineLatest(subjects.toArray());
      // }
      this.setSubject(name);
      return this._subjects.get(name).asObservable();
    }
    to(topic: string, message: IMessage) {
      if(topic!="*"){
        this.setSubject(topic);
        this._subjects.get(topic).next(message);
      }
      else{
        this._subjects.forEach((value)=>{value!.next(message)}); 
      }
    }
  }