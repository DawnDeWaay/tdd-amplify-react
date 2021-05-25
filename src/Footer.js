import { AmplifySignOut } from '@aws-amplify/ui-react';

function Footer() {
    return (
      <div data-testid="sign-out">
        <AmplifySignOut/>
      </div>
    );
  }
  
export default Footer;