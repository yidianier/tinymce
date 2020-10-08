import { Assertions, Chain, GeneralSteps, Logger, Pipeline, Step } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { TinyApis, TinyLoader } from '@ephox/mcagar';
import Editor from 'tinymce/core/api/Editor';
import * as GetSelectionContent from 'tinymce/core/selection/GetSelectionContent';
import Theme from 'tinymce/themes/silver/Theme';

UnitTest.asynctest('browser.tinymce.selection.GetSelectionContentTest', (success, failure) => {
  Theme();
  const cGetContent = (args: any) => Chain.mapper((editor: Editor) => GetSelectionContent.getContent(editor, args));

  const sAssertGetContent = (label: string, editor: Editor, expectedContents: string, args: any = {}) => Chain.asStep(editor, [
    cGetContent(args),
    Assertions.cAssertEq(label + ': Should be expected contents', expectedContents)
  ]);

  TinyLoader.setupLight((editor: Editor, onSuccess, onFailure) => {
    const tinyApis = TinyApis(editor);

    Pipeline.async({}, [
      Logger.t('Should be text content with leading visible spaces', GeneralSteps.sequence([
        tinyApis.sSetContent('<p>content<em> Leading space</em></p>'),
        tinyApis.sSetSelection([ 0 ], 1, [ 0 ], 2),
        sAssertGetContent('Should be some content', editor, ' Leading space', { format: 'text' })
      ]))
    ], onSuccess, onFailure);
  }, {
    selector: 'textarea',
    indent: false,
    base_url: '/project/tinymce/js/tinymce'
  }, success, failure);
});
