import {APlugin} from "../../plugin/APlugin";
import {IPluginHandlerDefinition} from "../../plugin/IPlugin";
import {IPluginEvent2} from "../../pluginEvent/IPluginEvents";
import {EntityRepositoryManager} from "../../../entity/EntityRepositoryManager";

export class $TranslationPlugin extends APlugin {

  readonly id = '$translation';

  private readonly CONTEXT_LANGUAGES = "contextLanguages";

  readonly handlers: IPluginHandlerDefinition[] = [
    { pattern: /entity\.preRoute/, callback: this.onEntityPreRoute }
  ];

  constructor(
    // readonly config: $TranslationPluginConfigInterface,
    readonly config: any,
    readonly configHash: string,
    protected entityRepositoryManager: EntityRepositoryManager
  ) {
    super(config, configHash, entityRepositoryManager);
  }

  private onEntityPreRoute(
    event: IPluginEvent2
  ): IPluginEvent2 {
    if (this.config.requestLanguageOn == 'urlPart') {
      this.setRequestLangaugeFromUrl(event);
    }
    else if (this.config.requestLanguageOn == 'headers') {
      this.setRequestLanguageFromHeaders(event);
    }
    return event;
  }

  private setRequestLangaugeFromUrl(
    event: IPluginEvent2
  ) {
    const pattern = /^(\/[a-z]{2})\/.+$/;
    const lang = pattern.exec(event.target.pathParts);
    if (lang !== null) {
      event.context[this.CONTEXT_LANGUAGES] = this.withDefaultLang([lang[1]]);
      event.target.pathParts = lang[2];
    }
  }

  private setRequestLanguageFromHeaders(
    event: IPluginEvent2
  ) {
    // @todo implement
    return this.withDefaultLang([]);
  }

  private withDefaultLang(languages: string[]): string[] {
    if (this.config.defaultLanguage &&
      (languages.indexOf(this.config.defaultLanguage) !== -1)
    ) {
      languages.push(this.config.defaultLanguage);
    }
    return languages;
  }

}
