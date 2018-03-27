import {APlugin} from "../../plugin/APlugin";
import {IPluginHandlerDefinition} from "../../plugin/IPlugin";
import {IPluginPrerouteEvent} from "../../pluginEvent/IPluginEvents";

export class $TranslationPlugin extends APlugin {

  private readonly CONTEXT_LANGUAGES = "contextLanguages";

  readonly handlers: IPluginHandlerDefinition[] = [
    { pattern: /entity\.preRoute/, callback: this.onEntityPreRoute }
  ];

  constructor(
    // readonly config: $TranslationPluginConfigInterface,
    readonly config: any,
    readonly configHash: string
  ) {
    super(config, configHash);
  }

  private onEntityPreRoute(
    event: IPluginPrerouteEvent
  ): IPluginPrerouteEvent {
    if (this.config.requestLanguageOn == 'urlPart') {
      this.setRequestLangaugeFromUrl(event);
    }
    else if (this.config.requestLanguageOn == 'headers') {
      this.setRequestLanguageFromHeaders(event);
    }
    return event;
  }

  private setRequestLangaugeFromUrl(
    event: IPluginPrerouteEvent
  ) {
    const pattern = /^(\/[a-z]{2})\/.+$/;
    const lang = pattern.exec(event.value.url);
    if (lang !== null) {
      event.context[this.CONTEXT_LANGUAGES] = this.withDefaultLang([lang[1]]);
      event.value.url = lang[2];
    }
  }

  private setRequestLanguageFromHeaders(
    event: IPluginPrerouteEvent
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
