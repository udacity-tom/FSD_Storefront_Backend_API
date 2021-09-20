import {
  DisplayProcessor,
  SpecReporter,
  StacktraceOption
} from 'jasmine-spec-reporter';
import CustomReporter = jasmine.CustomReporter;
import SuiteInfo = jasmine.JasmineStartedInfo;
class CustomProcessor extends DisplayProcessor {
  public displayJasmineStarted(info: SuiteInfo, log: string): string {
    return `TypeScript ${log}`;
  }
}

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(
  (new SpecReporter({
    spec: {
      displayStacktrace: StacktraceOption.NONE
    },
    customProcessors: [CustomProcessor]
  }) as unknown) as CustomReporter
);
