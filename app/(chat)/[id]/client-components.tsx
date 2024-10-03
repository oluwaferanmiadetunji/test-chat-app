'use client';

import { cn, parseDate } from '@/lib/utils';
import { useState, useEffect, useRef, ComponentProps, useTransition, Fragment, useContext } from 'react';
import { Message } from '@/lib/types';
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor';
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit';
import Textarea from 'react-textarea-autosize';
import { Button } from '@/components/ui/button';
import { IconArrowElbow } from '@/components/ui/icons';
import { toast } from 'sonner';
import { IconSpinner } from '@/components/ui/icons';
import { SocketContext } from '@/context/Socket';

const GatewayEvents = {
  CREATE_MESSAGE: 'create-message',
  NEW_MESSAGE: 'new-message',
  JOIN_CONVERSATION: 'join-conversation',
};

export interface ChatProps extends ComponentProps<'div'> {
  initialMessages: Message[];
  id: string;
  sendText(id: string, formData: FormData): Promise<any>;
  user: any;
}

export function Chat({ initialMessages, sendText, id, user }: ChatProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const { socket } = useContext(SocketContext);

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } = useScrollAnchor();

  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    socket?.emit(GatewayEvents.JOIN_CONVERSATION, { id });

    const handleMessage = (payload: any) => {
      setMessages(prevMessages => {
        const messageExists = prevMessages.some(message => message.id === payload.id);

        if (!messageExists) {
          return [...prevMessages, payload];
        }

        return prevMessages;
      });
    };

    socket?.on(GatewayEvents.NEW_MESSAGE, handleMessage);

    return () => {
      socket?.off(GatewayEvents.NEW_MESSAGE, handleMessage);
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setLoading(true);
    startTransition(() => {
      sendText(id, formData)
        .then(() => {
          setInput('');
          toast.success('Message sent!');
        })
        .catch(error => {
          console.log({ error });
          toast.error(error?.message || 'Error sending message');
        })
        .finally(() => setLoading(false));
    });
  };

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      <div className={cn('pb-[200px] pt-4 md:pt-10')} ref={messagesRef}>
        {messages?.length > 0 && <ChatList messages={messages} user={user} />}
        <div className="w-full h-px" ref={visibilityRef} />
      </div>

      <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
        <ButtonScrollToBottom isAtBottom={isAtBottom} scrollToBottom={scrollToBottom} />

        <div className="mx-auto sm:max-w-2xl sm:px-4">
          <div className="space-y-4 px-4 py-2 md:py-4">
            <form ref={formRef} onSubmit={handleSubmit} noValidate={false}>
              <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
                <Textarea
                  ref={inputRef}
                  tabIndex={0}
                  onKeyDown={onKeyDown}
                  placeholder="Send a message."
                  className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  name="text"
                  rows={1}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                />
                <div className="absolute right-0 top-[13px] sm:right-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="submit"
                        aria-disabled={loading || isPending}
                        disabled={loading || isPending || input === ''}
                        size="icon"
                      >
                        {loading || isPending ? (
                          <IconSpinner />
                        ) : (
                          <Fragment>
                            <IconArrowElbow />
                            <span className="sr-only">Send message</span>
                          </Fragment>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Send message</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ChatList {
  messages: any[];
  user: any;
}

function ChatList({ messages, user }: ChatList) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-3xl px-4">
      {messages.map(message => {
        return (
          <div key={message.id} className="w-full mb-2 pb-2">
            {user?.id === message?.receiver_id && (
              <div className="w-full justify-start ">
                <div className="max-w-[45%] bg-[transparent] border-[1px] border-gray-500 border-opacity-15 rounded-lg px-5 py-3">
                  <div className="mb-1">
                    <p>{message?.text}</p>
                  </div>
                  <p className="text-gray-500 text-[13px] text-right justify-end flex">
                    {parseDate(message?.created_at)}
                  </p>
                </div>
              </div>
            )}

            {user?.id === message?.sender_id && (
              <div className="w-full justify-end flex">
                <div className="max-w-[45%] w-full bg-zinc-950 border-[1px] border-gray-500 border-opacity-15 rounded-lg px-5 py-3">
                  <div className="mb-1">
                    <p className="text-green-500">{message?.text}</p>
                  </div>
                  <p className="text-gray-500 text-[13px] text-right justify-end flex">
                    {parseDate(message?.created_at)}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
