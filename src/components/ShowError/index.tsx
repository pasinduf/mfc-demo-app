import {
  RESPONSE_STATUS_400,
  RESPONSE_STATUS_403,
  RESPONSE_STATUS_404,
  RESPONSE_STATUS_500,
} from '../../api/auth/constants';
import ErrorBlock from './ErrorBlock';

type Props = {
  error: number | null;
};

export const ShowError = ({ error }: Props) => {
  switch (error) {
    case RESPONSE_STATUS_500:
      return (
        <ErrorBlock
          title="The server doesn’t respond"
          subtitle="Unfortunately, we cannot finish your request right now. Please, try later"
        />
      );
    case RESPONSE_STATUS_403:
      return (
        <ErrorBlock
          title="Something went wrong..."
          subtitle="Please log out and log in again"
        />
      );
    case RESPONSE_STATUS_400:
      return (
        <ErrorBlock
          title="Something went wrong..."
          subtitle="Please, try later"
        />
      );
    case RESPONSE_STATUS_404:
      return (
        <ErrorBlock
          title="Page not found"
          subtitle="Please, make sure you have typed the correct URL"
        />
      );
    default:
      return (
        <ErrorBlock
          title="Something went wrong..."
          subtitle="Please, try later"
        />
      );
  }
};
