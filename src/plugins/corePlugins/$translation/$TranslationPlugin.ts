import {APlugin} from "../../plugin/APlugin";
import {IPluginHandlerDefinition} from "../../plugin/IPlugin";
import {IPluginEntityEvent} from "../../pluginEvent/IPluginEntityEvent";
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
    event: IPluginEntityEvent
  ): IPluginEntityEvent {
    if (this.config.requestLanguageOn == 'urlPart') {
      this.setRequestLangaugeFromUrl(event);
    }
    else if (this.config.requestLanguageOn == 'headers') {
      this.setRequestLanguageFromHeaders(event);
    }
    return event;
  }

  private setRequestLangaugeFromUrl(
    event: IPluginEntityEvent
  ) {
    const pattern = /^(\/[a-z]{2})\/.+$/;
    const lang = pattern.exec(event.target.pathParts);
    if (lang !== null) {
      event.context[this.CONTEXT_LANGUAGES] = this.withDefaultLang([lang[1]]);
      event.target.pathParts = lang[2];
    }
  }

  private setRequestLanguageFromHeaders(
    event: IPluginEntityEvent
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
