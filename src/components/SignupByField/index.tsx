import * as React from 'react';
import * as classnames from 'classnames';
import { MouseEventHandler, ChangeEventHandler } from 'react';
import { FormattedMessage } from 'react-intl';

export interface InputFieldProps {
  input: {
    onChange: (e: any) => void;
    value?: 'bride' | 'groom';
    [key: string]: any;
  };
}

const InputField = ({ input }: InputFieldProps) => {
  return (
    <div className="form-group">
      <label className="label">
        <FormattedMessage id="signup.signupBy.title" />{' '}
      </label>

      <div className="signup-by-control-group">
        <div
          className={classnames('signup-by-control', { active: input.value === 'groom' })}
          onClick={() => input.onChange('groom')}
        >
          <FormattedMessage id="signup.signupBy.label.groom" />
        </div>
        <div
          className={classnames('signup-by-control', { active: input.value === 'bride' })}
          onClick={() => input.onChange('bride')}
        >
          <FormattedMessage id="signup.signupBy.label.bride" />
        </div>
      </div>
    </div>
  );
};

export default InputField;
